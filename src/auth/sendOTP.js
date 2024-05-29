const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const fs = require("fs");

module.exports = (res, email, name) => {
   const secret = speakeasy.generateSecret();
   const ms = secret.base32;
   const filepatch = `./src/auth/temp/${name}.txt`;

   fs.writeFile(filepatch, ms, (err) => {
      if (err) console.log("erreur" + err);
      else console.log("ecris avec succes");
   });
   //generer et envoie le token a l'utilisateur
   const token = speakeasy.totp({
      secret: secret.base32,
      encoding: "base32",
      step: 1800,
   });
   // envoie de l'email a l'utilisateur

   // Créez un objet transporter avec vos informations de connexion SMTP
   let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         // votre adresse mail et mot de passe d'aplication fourni par gmail
         user: "",
         pass: "", // https://myaccount.google.com/apppasswords c'est le lien pour avoir le mot de passe d'application
      },
      tls: {
         rejectUnauthorized: false,
      },
   });

   // Définissez les options de l'e-mail
   let mailOptions = {
       //votre adresse mail 
      from: "",
      to: email,
      subject: "Verification OTP",
      html: `
       <p style="font-size:18px;">ceci est votre code de validation OTP ne le partager avec personne</p>
        <div
            style="
            background-color: rgb(2, 2, 49);
            color: rgb(255, 21, 21);
            width: 200px;
            margin:0 50px ;
            text-align: center;
            font-size: 40px;
            "
        >
        ${token}
        </div>
        `,
   };

   // Envoyez l'e-mail
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         const message = "echec d'envoi de l'OTP";
         res.status(500).json({ message, error });
         return console.log("Erreur lors de l'envoi de l'e-mail:", error);
      }
      const message = "OTP envoyer avec succès valide pour 1800 secondes";
      res.status(200).json({ message });
      console.log("OTP  envoyé avec succès:", info.messageId);
   });
};
