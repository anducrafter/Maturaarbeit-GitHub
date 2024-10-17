const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const javamulter = require("../public/javascript/multer");

router.get("/profile", auth.isAuthenticated, async (req,res) =>{
    try{
        const user =  await collection.findOne({name: req.session.user});
        res.render('profile', {user: user, login: req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})
router.post("/profile",javamulter.upload, auth.isAuthenticated,async (req,res) =>{
    try {
        const user =  await collection.findOne({name: req.session.user});
        let file;
        if(req.files[0]){
           file = req.files[0].filename;
        }else {
            file = user.img;
        }
        const about = req.body.about;
        const phone = req.body.phone;
     
        const address = req.body.address;
        await  collection.updateOne({name: req.session.user}, {$set : {about: about, phone : phone , address: address}, img: file})
    
     res.redirect("/profile")
       
    }catch(err){
        console.log(err)
    }
   
    
  
})

module.exports = router;