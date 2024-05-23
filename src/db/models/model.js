// importation mongoose pour creer un shema de base de donnes
const mongoose = require('mongoose');

//initialisation du schema
const shema = mongoose.Schema
//creation du schema
const shema_menu_list = new shema({
    menu_name:{
        type:String,
        required:true,
        unique:true,
        maxLenght:200
    },
    menu_image:{
        type:String,
        maxLenght:2000,
        required:true,
    }

},{timestamps:true}
)

const shema_food_list = new shema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxLenght:200
    },
    image:{
        type:String,
        maxLenght:2000,
        required:true,
    },
    price:{
        type:Number,
        maxLenght:30,
        required:true
    },
    description:{
        type:String,
        maxLenght:3000,
        required:true
    },
    category:{
        type:String,
        maxLenght:300,
        required:true
    }

},{timestamps:true}
)
const user = new shema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxLenght:30
      },
      password:{
        type:String,
        required:true,
        maxLenght:300
      },
      email:{
        type:String,
        required:true,
        unique:true,
        maxLenght:300
      },
      telephone:{
        type:String,
        required:true,
        unique:true,
        maxLenght:30
      }

},{timestamps:true})

const commande = new shema({
  id_prod_comd:{
      type:String,
      required:true,
      maxLenght:30
    },
    id_util_comd:{
      type:String,
      required:true,
      maxLenght:1000
    },
    qte:{
      type:Number,
      required:true,
      maxLenght:300
    }

},{timestamps:true})

const commantaire = new shema({
  id_prod_commt:{
      type:String,
      required:true,
      maxLenght:30
    },
    name_util_commt:{
      type:String,
      required:true,
      maxLenght:1000
    },
    commantaire:{
      type:String,
      required:true,
      maxLenght:800
    }

},{timestamps:true})

const SchemaMenu_list =mongoose.model("menu_list",shema_menu_list)
const SchemaFood_list =mongoose.model("food_list",shema_food_list)

const SchemaUser =mongoose.model("utilisateur",user)
const ShemaCommt = mongoose.model('commantaire',commantaire)
const ShemaCommd = mongoose.model('commande',commande)


module.exports= {SchemaMenu_list,SchemaFood_list,SchemaUser,ShemaCommt,ShemaCommd}