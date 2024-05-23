const { request } = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "./../../.env" });

let key = process.env.KEY;
module.exports = (req, res, next) => {
   const authorizationHeader = req.headers.authorization;
   if (!authorizationHeader) {
      const message = "vous n'avez pas fournir de jeton d'authantification";
      res.status(401).json({ message });
   } else {
      const token = authorizationHeader.split(" ")[1];

      const decodedToken = jwt.verify(token, key, (error, decodedToken) => {
         if (error) {
            const message = `l'utilisateur n'a pas le droit d'acceder a la resource demander`;
            return res.status(401).json({ message, DataTransfer: error });
         }

         const userid = decodedToken.userId;
         if (req.method === "GET") {
            if (req.headers.userid !== userid) {
               const message = `l'identifient de l'utilisateur est invalide`;
               res.status(401).json(message);
            } else next();
         } else if (req.method === "POST") {
            if (req.body.userId !== userid) {
               const message = `l'identifient de l'utilisateur est invalide`;
               res.status(401).json(message);
            } else {
               next();
            }
         }
      });
   }
};
