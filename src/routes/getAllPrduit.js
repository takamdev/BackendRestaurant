const {findAllProduit} = require('./../controller/controlers.js')

module.exports = (app) =>{
    app.get('/api/produits',findAllProduit)
}
