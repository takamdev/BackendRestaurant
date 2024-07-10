const {SchemaMenu_list,SchemaFood_list} = require('./models/model.js')
const {food_list,menu_list}=require('./data.js')
const mongoose = require('mongoose')
module.exports = async ()=>{

  const collections = await mongoose.connection.db.listCollections().toArray();
   if(collections.length==0){
          menu_list.map( async (item)=>{
              
            const newPost  = new SchemaMenu_list({
                menu_name:item.menu_name,
                menu_image:item.menu_image,
            })
          try{
        
            const post = await newPost.save()
          console.log("base de donnée inisialiser");
          }catch(err){
            console.log("echec d'initialisation de la base de donnée " +err);
          }
        })

        food_list.map( async (item)=>{
            const newPost  = new SchemaFood_list({
                name:item.name,
                image:item.image,
                price:item.price,
                description:item.description,
                category:item.category,
            })
          try{
        
            const post = await newPost.save()
          console.log("base de donnée inisialiser");
          }catch(err){
            console.log("echec d'initialisation de la base de donnée " +err);
          }
        })
   }
    
        

}