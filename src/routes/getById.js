const {findProduitById} = require('./../controller/controlers.js')


module.exports= (app)=>{
    app.get('/api/produit/:id',findProduitById)
}