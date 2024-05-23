const {connexion} = require("./../controller/controlers.js")

module.exports = (app)=>{
    app.post('/api/sign',connexion)
}

