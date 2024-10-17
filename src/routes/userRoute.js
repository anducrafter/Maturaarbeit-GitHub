const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const evaluatecollection = require("../collection/config-img");
const auth = require("../public/javascript/auth");
const javamulter = require("../public/javascript/multer");

router.get("/user/:id", auth.isAuthenticated, async (req,res) =>{
    try{
        const user =  await collection.findOne({name: req.params.id});
        const evaluation = await evaluatecollection.find({name: req.params.id});
        res.render('user', {user: user, login: req.session.user, evaluation : evaluation});
        
    }catch(err){
        console.log(err)
    }
    
})
module.exports = router;