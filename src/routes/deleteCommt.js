const {deletCommt} = require("./../controller/controlers.js")
const auth = require('./../auth/auth.js')
module.exports = (app)=>{
      app.post('/api/comment/delete/:id', auth ,deletCommt) 
}

