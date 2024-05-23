const mondoDB = require('mongoose')

exports.connect = ()=>{
    mondoDB.set('strictQuery',true)

    mondoDB.connect(process.env.URLBD).then(()=>{
        console.log('connexion a la base de donnée établie');
    }).catch(errr=>console.error('erreur de connexion a la base de donnée'+errr))
}