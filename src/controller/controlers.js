const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./../../.env" });
const key = process.env.KEY;

const {
   SchemaMenu_list,
   SchemaFood_list,
   SchemaUser,
   ShemaCommt,
   ShemaCommd,
} = require("./../db/models/model.js");

const findAllProduit = async (req, res) => {
   try {
      let Menu_list = await SchemaMenu_list.find({}).sort({ createdAt: -1 });
      let Foot_list = await SchemaFood_list.find({}).sort({ createdAt: -1 });

      res.status(200).json({ Menu_list, Foot_list });
   } catch (error) {
      const message =
         "erreur de recuperation des données réessaiyez dans un instant";
      res.status(500).json({ message, error });
   }
};

const findProduitById = async (req, res) => {
   let id = req.params.id;
   if (id) {
      try {
         let produit = await SchemaFood_list.find({ _id: id });
         res.status(200).json({ produit });
      } catch (err) {
         const message =
            "echec de recuperation du produit réessaiyez dans un instant";
         res.status(500).json({ message });
      }
   } else {
      const message = `vous n'avez pas renseigner l'identifiant du produit`;
      res.status(404).json({ message });
   }
};

const addCommt = async (req, res) => {
   let commantaire = req.body.commantaire; //corp du commantaire
   let name_util_commt = req.body.name_util_commt; //l'id de l'utilisateur qui commante
   let id_prod_commt = req.body.id_prod_commt; //l'id du produit commanté
   if (commantaire && name_util_commt && id_prod_commt) {
      const newCommantaire = new ShemaCommt({
         id_prod_commt: id_prod_commt,
         name_util_commt: name_util_commt,
         commantaire: commantaire,
      });
      try {
         await newCommantaire.save();
         const message = "commantaire ajouter avec succes";
         res.status(201).json(message);
      } catch (error) {
         const message =
            "nous avons du mal a ajouter le commantaire réessaiyze plus tard";
         res.status(500).json({ message });
      }
   } else {
      const message = "verifier le corp de la requete il y'a  problème(s)";
      res.status(404).json({ message });
   }
};

const incription = async (req, res) => {
   let name = req.body.name;
   let password = req.body.password;
   let email = req.body.email;
   let telephone = req.body.telephone;
   if (name && password && email && telephone) {
      try {
         let userIsExist = await SchemaUser.find({
            $or: [{ email: email }, { telephone: telephone }, { name: name }],
         });
         if (userIsExist.length !== 0) {
            let other = [userIsExist[0].name,userIsExist[0].email,userIsExist[0].telephone];
            let message =["email déjà utiliser","numéro déjà utiliser","nom déjà utiliser"]
            // gestion des reponse en fonction des donnees de BD
            if(name===other[0]&&email!==userIsExist[0].email&&telephone!==userIsExist[0].telephone){
              return res.status(404).json({ message:message[2] });
            }else if(name!==other[0]&&email===userIsExist[0].email&&telephone!==userIsExist[0].telephone){
               return res.status(404).json({ message:message[0] });
            }else if((name!==other[0]&&email!==userIsExist[0].email&&telephone===userIsExist[0].telephone)){
               return res.status(404).json({ message:message[1] });
            }else{
               return res.status(404).json({ message:"plus d'une information sont  déjà utiliser réessaiyez" });
            }
           

            
         } else {
            // enoyer l'otp a l'utilisateur
            require("./../auth/sendOTP.js")(res, email, name);
         }
      } catch (error) {
         const message = "erreur d'enregistrement de l'utilisateur";
         res.status(500).json({ message });
      }
   } else {
      const message = "verifier le corp de la requete il y'a  problème(s)";
      res.status(404).json({ message });
   }
};

const connexion = (req, res) => {
   let email_or_name = req.body.ref;
   let password = req.body.password;
   if (email_or_name && password) {
      SchemaUser.find({
         $or: [{ email: email_or_name }, { name: email_or_name }],
      })
         .then((user) => {
            bcrypt
               .compare(password, user[0].password)
               .then((isvalid) => {
                  if (!isvalid) {
                     const message = "mot de passe incorrect";
                     res.status(404).json({ message });
                  } else {
                     const message = `l'utilisateur est connecter avec success`;
                     const token = jwt.sign({ userId: user[0].id }, key, {
                        expiresIn: "24h",
                     });
                     res.status(200).json({
                        message,
                        id: user[0].id,
                        userName: user[0].name,
                        token: token,
                     });
                  }
               })
               .catch((error) => {
                  const message = "echec de connexion réessaiyez plus tard";
                  res.status(501).json({ error, message });
               });
         })
         .catch((error) => {
            const message = `adresse email ou nom d'uilisateur incorrect`;
            res.status(404).json({ error, message });
         });
   } else {
      const message = "entrez les informations de connexion";
      res.status(404).json({ message });
   }
};

const deleteUser = (req, res) => {
   const id = req.params.id; // l'id de l'utilisateur a supprimer
   if (id) {
      console.log(id);
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
const deleteCommd=(req,res)=>{
    const id = req.params.id 
    if(id){
      console.log(id);
      ShemaCommd.deleteMany({id_prod_comd:id}).then((rep)=>{
         if(rep.deletedCount!==0){
            const message = "commade supprimer"
            res.status(202).json({message})
         }
      }).catch(err=>{
         const message = "echec"
         res.status(500).json({message})
      })
    }else{
      const message = "vous n'avez pas fournir l'identiant du produit"
      res.status(404).json({message})
    }
}
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

const sauvegarde_utilisateur = async (req, res) => {
   //ecriture dans la base de donnes

   let name = req.body.name;
   let password = req.body.password;
   let email = req.body.email;
   let telephone = req.body.telephone;
   return bcrypt.hash(password, 10).then(async (hash) => {
      let newUser = new SchemaUser({
         name: name,
         password: hash,
         email: email,
         telephone: telephone,
      });
      let post = await newUser.save();
      const message = "utiliser enregitrer avec success";

      res.status(200).json({ message, id: post._id });
   });
};
module.exports = {
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
   deleteCommd
};
