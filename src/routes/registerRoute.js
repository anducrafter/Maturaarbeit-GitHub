const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const bycript = require("bcrypt");

router.get("/register", (req,res) =>{
    res.render("sign",{login : req.session.user});
})

router.post("/register",async (req,res) =>{
    try {
       
    const data = {
        name: req.body.username,
        email: req.body.email,
        auctions: new Array(),
        create: new Array(),
        bewertung: 5,
        password: req.body.password,
        about: "",
        phone: null,
        address: "",
        file: "",
        img: ""

    }
   const username = await collection.findOne({name: data.name})
   const email = await collection.findOne({email: data.email})
   if(username || email ){
    res.send("Bitte gib ein anderen username oder passwort an")
   }else{
    const hasedPassword = await bycript.hash(data.password,9);
    data.password = hasedPassword;
    const userdata = await collection.insertMany(data);
   
    res.send("Erfolgreich User erstellt!")
   }
   
}catch(err){
    console.log(err)
   
}

});

module.exports = router;