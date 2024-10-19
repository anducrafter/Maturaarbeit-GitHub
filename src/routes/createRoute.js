const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const multer = require("../public/javascript/multer");

router.get("/create", auth.isAuthenticated, async (req,res) =>{
    const user = await collection.findOne({name: req.session.user}) || false
    res.render("uploade",{login : req.session.user, user: user });
})

router.post("/create", multer.upload, auth.isAuthenticated,async (req,res) =>{
    try {
        //Save image in database
        const data = {
            startbit: req.body.startbit,
            titel: req.body.titel,
            description: req.body.description,
            time: req.body.time,
            categorique: req.body.options
        }
        
        const aution = new auctioncollection();
        aution.titel = data.titel;
        aution.description = data.description;
        aution.startbit = data.startbit;
        aution.creator = req.session.user;
        aution.bithistory = []
        aution.categorique = data.categorique;
        aution.status = 1;
        const date = new Date();
        

        aution.timestamp = date.getTime()+1000 * 60 * 60 * 24 *data.time;
     //das hier ist für testphase    aution.timestamp = datee.getTime()+1000 * 60 * data.time;
        aution.biter = "";
    
   req.files.forEach((image, index) =>{
    console.log(image.filename)
    aution.img.push(image.filename);
   })
       
        aution.save().then(() =>{

        }).catch((err) =>{
            console.log(err);
            console.log("Fehler beim Auction in databank Speichern")
        })
        const user =   await collection.findOne({name: req.session.user});
        let userauction;
        if(user.create != null ? userauction = user.create : userauction = []);
         userauction.push(aution._id);
         await  collection.updateOne({name: req.session.user}, {$set : {create: userauction}})
         res.redirect("/")
      
    }catch(err){
        console.log(err)
    }
   
    
  
})

module.exports = router;