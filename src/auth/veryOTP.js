const speakeasy = require("speakeasy");
const fs = require("fs");

module.exports = (req, res, next) => {
   let name = req.body.name;
   let token = req.body.token;
   let secret = "";

   if (name && token) {
      const filepatch = `./src/auth/temp/${name}.txt`;

      fs.readFile(filepatch, "utf-8", (err, data) => {
         if (err) {
            const message = "une erreur est survenue essaiez plus tart";
            res.status(500).json({ message });
         } else {
            secret = data;
            const isvalid = speakeasy.totp.verify({
               secret: secret,
               encoding: "base32",
               token: token,
               step: 1800,
            });
            if (isvalid) {
               fs.unlink(filepatch, (err) => {
                  console.log("echec de supression " + err);
               });
               next();
            } else {
               const message =
                  "l'OTP saisie pas l'utilisateur n'est pas valide";
               res.status(404).json({ message });
            }
         }
      });
   } else {
      const message = "verifier que les information sont la";
      res.status(400).json({ message });
   }
};
