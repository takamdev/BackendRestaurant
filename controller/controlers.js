const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./../.env" });
const KEY = process.env.KEY;

// importation des differents schemas de base de donnée
const {
   SchemaMenu_list,
   SchemaFood_list,
   SchemaUser,
   ShemaCommt,
   ShemaCommd,
} = require("./../db/models/model.js");

// recuperer tous les produits de la base de donnée
const findAllProduit = async (req, res) => {

   try {
      /*
       recuperation des données de  du menu et des repars
      */
      let Menu_list = await SchemaMenu_list.find({}).sort({ createdAt: -1 });
      let Foot_list = await SchemaFood_list.find({}).sort({ createdAt: -1 });

      // renvoie des données au format json
      res.status(200).json({ Menu_list, Foot_list });
   } catch (error) {
      // message d'erreur en cas d'erreur
      const message =
         "erreur de recuperation des données réessaiyez dans un instant";
      res.status(500).json({ message, error });
   }
};

// recuperer un produit pas sont id
const findProduitById = async (req, res) => {
   // recuperation de l'indantifiant du produit dans les parametres de la requete http
   let id = req.params.id
   // si le parametre id existe ont recupere le produit en question
   if (id) {
      try {
         let produit = await SchemaFood_list.find({ _id: id });
         res.status(200).json({ produit });
      } catch (err) {
         // cas d'erreur 
         const message =
            "echec de recuperation du produit réessaiyez dans un instant";
         res.status(500).json({ message });
      }
   } else {
      // si le parametre id n'est pas trouver ont renvoie une erreur 404 au client de l'api
      const message = `vous n'avez pas renseigner l'identifiant du produit`;
      res.status(404).json({ message });
   }
};

// ajouter un commentaire
const addCommt = async (req, res) => {
   let commantaire = req.body.commantaire; //corp du commantaire
   let name_util_commt = req.body.name_util_commt; //l'id de l'utilisateur qui commante
   let id_prod_commt = req.body.id_prod_commt; //l'id du produit commanté
   // si tous les paramtre sont present alors
   if (commantaire && name_util_commt && id_prod_commt) {
      // initialisation d'un nouveau schema de bd
      const newCommantaire = new ShemaCommt({
         id_prod_commt: id_prod_commt,
         name_util_commt: name_util_commt,
         commantaire: commantaire,
      });
      try {
         // sauvegar dans la base de donnée
         const saveres = await newCommantaire.save();
         res.status(201).json(saveres);
      } catch (error) {
         // cas d'erreur
         const message =
            "nous avons du mal a ajouter le commantaire réessaiyze plus tard";
         res.status(500).json({ message });
      }
   } else {
      // si tous les parametre ne sont pas trouver alors ont renvoie une reponse 404
      const message = "verifier le corp de la requete il y'a  problème(s)";
      res.status(404).json({ message });
   }
};

// inscription d'un nouvel utilisateur
const incription = async (req, res) => {

   // recuperation des données du corp de la request
   let name = req.body.name;
   let password = req.body.password;
   let email = req.body.email;
   let telephone = req.body.telephone;
   // verification de la presence des données
   if (name && password && email && telephone) {

      try {
         // verification si les donnes sont déjà dans la base de donnée
         let userIsExist = await SchemaUser.find({
            $or: [{ email: email }, { telephone: telephone }, { name: name }],
         });
         // si les données sont déjà existant
         if (userIsExist.length !== 0) {
            // recuperation de chaque données et stockage
            let other = [
               userIsExist[0].name,
               userIsExist[0].email,
               userIsExist[0].telephone,
            ];
            // regroupement des differente reponse possible
            let message = [
               "email déjà utiliser",
               "numéro déjà utiliser",
               "nom déjà utiliser",
            ];
            // gestion des reponse
            if (
               name === other[0] &&
               email !== userIsExist[0].email &&
               telephone !== userIsExist[0].telephone
            ) {
               return res.status(404).json({ message: message[2] }); // cas ou le nom d'utilisateur existe déjà
            } else if (
               name !== other[0] &&
               email === userIsExist[0].email &&
               telephone !== userIsExist[0].telephone
            ) {
               return res.status(404).json({ message: message[0] });// cas ou l'email existe déjà
            } else if (
               name !== other[0] &&
               email !== userIsExist[0].email &&
               telephone === userIsExist[0].telephone
            ) {
               return res.status(404).json({ message: message[1] });// cas ou le numero existe déjà
            } else {
               // si plusieur donnes existe déjà
               return res
                  .status(404)
                  .json({
                     message:
                        "plus d'une information sont  déjà utiliser réessaiyez",
                  });
            }
         } else {

            // si les information ne sont pas dans la bd alors  envoyer l'otp a l'utilisateur
            require("../middleware/authantification/sendOTP.js")(res, email, name);
         }
      } catch (error) {
         const message = "erreur d'enregistrement de l'utilisateur";
         res.status(500).json({ message });
      }
   } else {
      // si les données ne sont pas present dans le corp de la requete
      const message = "verifier le corp de la requete il y'a  problème(s)";
      res.status(404).json({ message });
   }
};

// connexion d'un utilisateur
const connexion = (req, res) => {
   //  recuperation des données dans le corp de la requete
   let email_or_name = req.body.ref;
   let password = req.body.password;
   // verification de l'existe dans des données
   if (email_or_name && password) {
      // recuperation des donneés dans la bd
      SchemaUser.find({
         $or: [{ email: email_or_name }, { name: email_or_name }],
      })
         .then((user) => {
            // verification de l'authantification des informations de l'utilisateur
            bcrypt
               .compare(password, user[0].password)
               .then((isvalid) => {
                  if (!isvalid) {
                     // cas ou le mot de passe est incorrect
                     const message = "email ou mot de passe incorrect";
                     res.status(404).json({ message });
                  } else {
                     // cas ou les informations de connexion sont authantifier avec success
                     const message = `l'utilisateur est connecter avec success`;
                     // generer le tokn d'authaurisation
                     const token = jwt.sign({ userId: user[0].id }, process.env.KEY, {
                        expiresIn: "24h",// validité du token a 24h
                     });
                     // envoie des données utilisateur
                     res.status(200).json({
                        message,
                        id: user[0].id,
                        userName: user[0].name,
                        token: token,
                     });
                  }
               })
               .catch((error) => {
                  // cas d'echec si il y'a probleme de serveur
                  const message = "echec de connexion réessaiyez plus tard";
                  res.status(501).json({ error, message });
               });
         })
         .catch((error) => {
            // cas ou l'email ou le nom d'utilisateur est incorrect
            const message = `email ou mot de passe incorrect`;
            res.status(404).json({ error, message });
         });
   } else {
      // si les données ne sont pas present dans la requete
      const message = "entrez les informations de connexion";
      res.status(404).json({ message });
   }
};

// supprimer un utilisateur
const deleteUser = (req, res) => {
   const id = req.params.id; // l'id de l'utilisateur a supprimer
   if (id) {
      SchemaUser.deleteOne({ _id: id })
         .then((rep) => {
            if (rep.deletedCount !== 0) {
               const message = "utilisateur suprimer avec success";
               res.status(201).json({ message });
            } else {
               const message = `l'utilisateur n'existe pas`;
               res.status(404).json({ message });
            }
         })
         .catch((error) => {
            const message = "echec de suppression";
            res.status(500).json({ message, error });
         });
   } else {
      const message = "entrez l'identifiant de l'utilisateur";
      res.status(404).json({ message });
   }
};

// supprimmer une commande
const deleteCommd = (req, res) => {
   const id = req.params.id;
   if (id) {
      console.log(id);
      ShemaCommd.deleteOne({ _id: id })
         .then((rep) => {
            if (rep.deletedCount !== 0) {
               const message = "commade supprimer";
               res.status(202).json({ message });
            }
         })
         .catch((err) => {
            const message = "echec";
            res.status(500).json({ message });
         });
   } else {
      const message = "vous n'avez pas fournir l'identiant du produit";
      res.status(404).json({ message });
   }
};

//recuperer un commantaire
const getcommt = async (req, res) => {
   let id_prod_commt = req.params.id; // l'id du produit qu'on n'a commenté
   if (id_prod_commt) {
      try {
         let commantaire = await ShemaCommt.find({
            id_prod_commt: id_prod_commt,
         });
         const message = "voici le commantaire chercher";
         res.status(200).json({ message, commantaire });
      } catch (error) {
         const message = "echec de recuperation du commantaire";
         res.status(500).json({ error, message });
      }
   } else {
      const message = "vous n'avez pas renseignier l'indentifiant du produit";
      res.status(404).json({ message });
   }
};

//ajouter une commande
const addCommd = async (req, res) => {
   let id_produit = req.body.id_prod_comd; //l'id du produit commander
   let id_util = req.body.id_util_comd; //l'id de l'utilisateur qui commande
   let qte = req.body.qte; // la quantité de la commande
   let newCommd = new ShemaCommd({
      id_prod_comd: id_produit,
      id_util_comd: id_util,
      qte: qte,
   });
   try {
      await newCommd.save();
      const message = "commande ajouter avec success";
      res.status(200).json({ message });
   } catch (error) {
      const message = "echec d'enregistrement de la commande";
      res.status(500).json({ message });
   }
};

// recuperer une commande
const getCommd = async (req, res) => {
   // identifiant de l'utilisateur qui a commader
   const id_util = req.params.id;
   //recuperation des commades de l'utilisateur
   try {
      let commande = await ShemaCommd.find({ id_util_comd: id_util });
      const message = "voici les(la) commande(s) chercher";
      res.status(200).json({ message, commande });
   } catch (error) {
      const message = "echec de recuperation des(de) commande(s)";
      res.status(500).json({ message });
   }
};

// sauvergarder un utilisateur apres sont inscription et sont authantification
const sauvegarde_utilisateur = async (req, res) => {
   //ecriture dans la base de donnes

   let name = req.body.name;
   let password = req.body.password;
   let email = req.body.email;
   let telephone = req.body.telephone;
   // cryptage du mot de passe anvant la sauvegard dans la bd
   return bcrypt.hash(password, 10).then(async (hash) => {
      let newUser = new SchemaUser({
         name: name,
         password: hash,
         email: email,
         telephone: telephone,
      });
      let post = await newUser.save(); // savegard
      const message = "utiliser enregitrer avec success";

      res.status(200).json({ message, id: post._id });
   });
};

// envoie d'un message a l'administrateur du site
const sendMsg = (req, res) => {
   let msg = req.body.message;
   let subjet = req.body.subjet;
   let name = req.body.name;

   let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
         user: "otpfoodie@gmail.com",
         pass: "lryw mcug enfq utrf", // https://myaccount.google.com/apppasswords c'est le lien pour avoir le mot de passe d'application
      },
      tls: {
         rejectUnauthorized: false,
      },
   });

   // Définissez les options de l'e-mail
   let mailOptions = {
      from: "otpfoodie@gmail.com",
      to: "takamloic35@gmail.com",
      subject: subjet,
      html: `
          <p style="font-size:18px;">ceci est un message provenant d'un visiteur de votre site</p>
           <div
               style="
               background-color: rgb(2, 2, 49);
               color: white;
               width: 100%;
               font-size:20px;
               text-align: center;
               "
           >
           <p>
            nom: ${name} <br/>
            message: ${msg}
           </p>
           
           </div>
           `,
   };

   // Envoyez l'e-mail
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
         const message = "echec d'envoi du message";
         res.status(500).json({ message, error });
         return console.log("Erreur lors de l'envoi de l'e-mail:", error);
      }
      const message = "message envoyer avec success";
      res.status(200).json({ message });
      console.log("message envoyer avec success", info.messageId);
   });
};

// supprimer un commentaire
const deletCommt = async (req, res) => {
   const id = req.params.id;

   try {
      await ShemaCommt.deleteOne({ _id: id });
      const message = "suprimer avec succes";
      res.status(202).json(message);
   } catch (error) {
      console.log(error);
      const message = "echec de suppresion du commantaire";
      res.status(500).json(message);
   }
};

// exportation des differentes fonctions
module.exports = {
   deletCommt,
   sendMsg,
   findAllProduit,
   findProduitById,
   addCommt,
   incription,
   connexion,
   deleteUser,
   getcommt,
   addCommd,
   getCommd,
   sauvegarde_utilisateur,
   deleteCommd,
};
