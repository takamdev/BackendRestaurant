const {deleteCommd} = require('./../controller/controlers.js')
const auth=require('./../auth/auth.js')

module.exports = (app)=>{
    app.post('/api/commd/delete/:id',auth,deleteCommd)
}