const {incription} = require('./../controller/controlers.js')
module.exports = (app)=>{
    app.post('/api/sign-up',incription)
}