const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const appRouter = require("./routes/web.js")
const mongoDB = require('mongoose')
const bodyParser = require("body-parser");
const initDb = require("./db/initbd.js");
const env = require("dotenv")
const app = express();

env.config({ path: "./.env" });
app.use(morgan("dev")).use(bodyParser.json()).use(cors());
app.use("",appRouter)
app.get("/api", (req, res) => {
   res.send("hello world");
});

// demarrage du serveur express
app.listen(process.env.PORT, () => {
   console.log(
      "server demarrer avec success sur l'address: http://localhost:" +
         process.env.PORT
   );
});

//connexion a la base de donnée
mongoDB.set('strictQuery',true)
mongoDB.connect(process.env.URLBD).then(()=>{
    console.log('connexion a la base de donnée établie');
    // initialisation e la base  de donnée
    initDb();
}).catch(errr=>console.error('erreur de connexion a la base de donnée'+errr))