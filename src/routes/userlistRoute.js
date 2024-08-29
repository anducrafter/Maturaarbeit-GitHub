const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const evaluatecollection = require("../collection/config-img");
const auth = require("../public/javascript/auth");


router.get("/userlist", auth.isAuthenticated, async (req,res) =>{
    try{
        const users =  await collection.find({});
        res.render('administrator/userlist', {users: users, login: req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})
module.exports = router;