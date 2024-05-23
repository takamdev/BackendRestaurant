const {getcommt} = require("./../controller/controlers.js")
const auth = require('./../auth/auth.js')

module.exports = (app)=>{
    app.get('/api/commentaire/:id',auth,getcommt)
}