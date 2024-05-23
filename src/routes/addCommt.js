const {addCommt} = require('./../controller/controlers.js')
const auth = require('./../auth/auth.js')
module.exports = (app)=>{
    app.post('/api/commt/post',auth,addCommt)
}

