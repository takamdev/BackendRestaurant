const {getCommd} = require('./../controller/controlers.js')
const auth = require('./../auth/auth.js')
module.exports = (app)=>{
    app.get('/api/commande/:id',auth,getCommd)
}