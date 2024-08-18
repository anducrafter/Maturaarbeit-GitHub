const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");


router.get("/s/:id",auth.isAuthenticated, async (req,res) =>{
   
    try{

        let query = req.query;
       
       if (Object.keys(req.query).length === 0){
            query = "";
        }else {
            query = "?"+req.originalUrl.split('?')[1];
        }
       const search = req.query.search;
       const user =  await collection.find({name: req.session.user}) || false
        if(req.params.id == "ALL"){
            const auction = await auctioncollection.find({titel: { $regex: "(?i)(.*" + search + ".*)"}});
          res.render('category', { auctions: auction , login : req.session.user, query : query, user: user});
         
          return;
        }
        
       const  auction = await auctioncollection.find({categorique: req.params.id, titel: { $regex: "(?i)(.*" + search + ".*)"}});
      
       res.render('category', { auctions: auction , login : req.session.user, query : query, user: user});
        
    }catch(err){
        console.log(err)
    }
    
})

module.exports = router;