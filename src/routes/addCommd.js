const {addCommd} = require("./../controller/controlers.js")
const auth = require('./../auth/auth.js')
module.exports = (app)=>{
      app.post('/api/commande/post', auth ,addCommd)
}

