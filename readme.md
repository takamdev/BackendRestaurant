#Foodie

-l'application backend du restaurant Foodie

-[code source du front-end react](https://github.com/takamdev/Foodie)
-[tester les poinds de terminaisons](https://backend-restaurant-beta.vercel.app/)
-[visiter l'application](https://foodie-nine-omega.vercel.app/)


/_
{
ajout de commande
methode http : post
router : /api/commande/post
shemaAttendue:{
id_prod_comd,
id_util_comd,
qte
}
}
,
{
contact
methode http : post
router : /api/contact
shemaAttendue:{
    let msg = req.body.message,
    let subjet = req.body.subjet,
    let name = req.body.name,
}
},
{
ajout de commantaire
methode http : post
router : /api/commt/pos
shemaAttendue:{
commantaire,
name_util_commt,
id_prod_commt
}
},
{
connexion
methode http : post
router : /api/sign
shemaAttendue:{
ref:(nom ou email) ,
password
}  
},
{
suprimer un utilisateur pas sont id
methode http : post
router : /api/user/delete/:id
},
{
recuperer tout les produits
methode http : get
router : /
},
,
{
recuperer un produit pas l'id
methode http : get
router : /api/produit/:id
} ,
{
recuperer les commandes d'un client pas l'id du client
methode http : get
router : /api/commande/:id
} ,
{
recuperer les commantaires d'un produit pas l'id du produit
methode http : get
router : /api/commentaire/:id
} ,
{
inscription
methode http : post
router : /api/sign-up
shemaAttendue:{
name,
password,
email,
telephone
}
},
{
otp verifications
methode http : post
router : /api/sign-up/otp-auth
shemaAttendue:{
name,
password,
email,
telephone,
token
}
}
_/
