const {sendMsg} = require("./../controller/controlers.js")
const auth = require('./../auth/auth.js')

module.exports = (app)=>{
    app.post('/api/contact',auth,sendMsg)
}