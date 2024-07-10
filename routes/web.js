const { Router } = require("express");
const auth = require("../middleware/authorization/auth.js");
const controler = require("./../controller/controlers.js");
const veryOTP = require("../middleware/authantification/veryOTP.js");
const Route = Router()

Route.post("/api/commande/post", auth, controler.addCommd);
Route.post("/api/commt/post", auth, controler.addCommt);
Route.post("/api/sign", controler.connexion);
Route.post("/api/sign-up/otp-auth", veryOTP, controler.sauvegarde_utilisateur);
Route.post("/api/commd/delete/:id", auth, controler.deleteCommd);
Route.post("/api/comment/delete/:id", auth, controler.deletCommt);
Route.post("/api/user/delete/:id", auth, controler.deleteUser);
Route.get("/", controler.findAllProduit);
Route.get("/api/produit/:id", controler.findProduitById);
Route.get("/api/commande/:id", auth, controler.getCommd);
Route.get("/api/commentaire/:id", auth, controler.getcommt);
Route.post("/api/sign-up", controler.incription);
Route.post("/api/contact", auth, controler.sendMsg);

module.exports = Route;
