const jwt = require("jsonwebtoken"); 

require("dotenv").config({ path: "./../../.env" });

let key = process.env.KEY; // clé de dechiffrement du token d'authorisation


module.exports = (req, res, next) => {
   // recuperation du token d'authorisation
   const authorizationHeader = req.headers.authorization;
   //si  authorizationHeader n'existe pas
   if (!authorizationHeader) {
      const message = "vous n'avez pas fournir de jeton d'authorisation";
      res.status(401).json({ message });
   } else {
      // si authorizationHeader existe

      
      const token = authorizationHeader.split(" ")[1]; // extraire le token

      // verifier que le token est valide
      const decodedToken = jwt.verify(token, key, (error, decodedToken) => {
         if (error) {
            // si le token n'est pas valid
            const message = `l'utilisateur n'a pas le droit d'acceder a la resource demander`;
            return res.status(401).json({ message, DataTransfer: error });
         }
         // si le token est valide
         const userid = decodedToken.userId; // extaire l'id de l'utilisateur a l'orogine de ce chiffrement

         /* si la  methode http est get ont cherche
            userId dans l'entete de la requete
            si la methode http est post on cherche userid dans le corp de la requete
         */
         if (req.method === "GET") { 
            // si userid n'est pas celui de l'id a l'origine du chiffrement 
            if (req.headers.userid !== userid) {
               const message = `l'identifient de l'utilisateur est invalide`;
               res.status(401).json(message);

               // si userid est  celui de l'id a l'origine du chiffrement 
            } else next();
         } else if (req.method === "POST") {
            if (req.body.userId !== userid) {
                 // si userid n'est pas celui de l'id a l'origine du chiffrement 
               const message = `l'identifient de l'utilisateur est invalide`;
               res.status(401).json(message);
            } else {
               // si userid est  celui de l'id a l'origine du chiffrement 
               next();
            }
         }
      });
   }
};
