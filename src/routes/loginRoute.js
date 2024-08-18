const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const bycript = require("bcrypt");

router.get("/login" , async (req,res) =>{
    const user =  await collection.find({name: req.session.user}) || false
    res.render("login", {login : req.session.user, user: user});
})

router.post("/login" ,async (req,res) =>{
    try{ 
        const data={
        name: req.body.username,
        password: req.body.password
    }

        const user = await collection.findOne({name: data.name})
        
        if(!user){
            res.send("Kein User vorhanden");
        }
        const passwordis = await bycript.compare(data.password,user.password)
        if(passwordis){
           const haseduser =  await bycript.hash(user.name,9);
         
            req.session.user = user.name;
            res.cookie('login',JSON.stringify(user.name), {
                httpOnly: true, // Helps prevent XSS attacks
                secure: false,   // Ensures cookie is sent over HTTPS
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
              });
            res.redirect("/")
            var randomNumber=Math.random().toString();
            randomNumber=randomNumber.substring(2,randomNumber.length);
         
        }else{
            res.send("Falsches Passwort")
        }

    }catch(err){
        console.log(err)
    }
})

module.exports = router;