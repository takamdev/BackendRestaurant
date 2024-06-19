const speakeasy = require("speakeasy");
const fs = require("fs");

module.exports = (req, res, next) => {
   // recuperation des données de verification
   let name = req.body.name;
   let token = req.body.token;
   // varible de stokage du secret ecrit dans un fichier txt lord de l'nvoi de l'OTP
   let secret = "";
   
   // si les données sont presents
   if (name && token) {
      // chemin vers le secret de l'utilisateur concerner
      const filepatch = `./middleware/authantification/temp/${name}.txt`;
      // lecture du secret
      fs.readFile(filepatch, "utf-8", (err, data) => {
         if (err) {
            const message = "une erreur est survenue essaiez plus tart";
            res.status(500).json({ message });
         } else {
            secret = data; // secret
            // authantification du token
            const isvalid = speakeasy.totp.verify({
               secret: secret,
               encoding: "base32",
               token: token,
               step: 1800,
            });
            // si le token est  valide
            if (isvalid) {
               // supprimer le fichier contenant le secret
               fs.unlink(filepatch, (err) => {
                  console.log("echec de supression " + err);
               });
               // passer au middleware suivant
               next();
            } else {
               // le token n'est pas valide erreur 404
               const message =
                  "l'OTP saisie pas l'utilisateur n'est pas valide";
               res.status(404).json({ message });
            }
         }
      });
   } else {
      // si les données de verifications ne sont disponible alors erreur 400
      const message = "verifier que les information sont la";
      res.status(400).json({ message });
   }
};
