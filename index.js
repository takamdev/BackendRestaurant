const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const bd = require("./src/config/connect.js");
const initDb = require("./src/db/initbd.js");
const app = express();

require("dotenv").config({ path: "./.env" });
app.use(morgan("dev")).use(bodyParser.json()).use(cors());
//conexion et initialisation de la bd
bd.connect();
initDb();

// differente route
require("./src/routes/getAllPrduit.js")(app);
require("./src/routes/getById.js")(app);
require("./src/routes/inscription.js")(app);
require("./src/routes/addCommt.js")(app);
require("./src/routes/connexion.js")(app);
require("./src/routes/deleteUser.js")(app);
require("./src/routes/getCommt.js")(app);
require("./src/routes/addCommd.js")(app);
require("./src/routes/getCommd.js")(app);
require("./src/routes/authantif.js")(app);
require("./src/routes/deleteCommd.js")(app);
require("./src/routes/sendMsg.js")(app)
require("./src/routes/deleteCommt.js")(app)

app.get("/api", (req, res) => {
   res.send("hello world");
});

app.listen(process.env.PORT, () => {
   console.log(
      "server demarrer avec success sur l'address: http://localhost:" +
         process.env.PORT
   );
});
