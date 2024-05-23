const {sauvegarde_utilisateur} = require('./../controller/controlers.js')
const veryOTP = require('./../auth/veryOTP.js')
module.exports= (app)=>{
    app.post('/api/sign-up/otp-auth',veryOTP,sauvegarde_utilisateur)
}