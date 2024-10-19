const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const bycript = require("bcryptjs");
const flash = require("express-flash")
router.get("/login:id?" , async (req,res) =>{
    const user =  await collection.find({name: req.session.user}) || false
    res.render("login", {login : req.session.user, user: user,message : req.flash()});
})

router.get("/out" , async (req,res) =>{
        res.clearCookie('login');
        delete req.session.user; 
        res.redirect("/");
})



router.get("/loginauth/:id/:user" , async (req,res) =>{
    const id = req.params.id;
    const username = req.params.user;
    const user = await collection.findOne({name: username});
    console.log("gmaing v3")
    if(!user){
        console.log("gmaing v2")
        res.redirect("/");
    }
    if(user.verifyid != id){
        console.log("gmaing v2",user.id,id)
        res.redirect("/");
    }
    user.verify = true;
    await collection.updateOne(user);
    res.redirect("/login");

})

router.post("/login" ,async (req,res) =>{
    try{ 
        const data={
        name: req.body.username,
        password: req.body.password
    }

        const user = await collection.findOne({name: data.name})
        
        if(!user){
            req.flash("error","Falsches Passwort oder kein Benutzer");
            return  res.redirect("/login");
        }
        if(user.verify = false){
            req.flash("error","Account ist nicht verifiziert ");
            return  res.redirect("/login");
        }
        const passwordis = await bycript.compare(data.password,user.password);

        if(!passwordis){
            req.flash("error","Falsches Passwort oder kein Benutzer");
            return  res.redirect("/login");
        }
            req.session.user = user.name;

            //Setze den Cookie für den Benutzer
            res.cookie('login',auth.encrypt(user.name), {
                httpOnly: true, // Helps prevent XSS attacks
                secure: false,   // Ensures cookie is sent over HTTPS
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
              });
            res.redirect("/")
         

    }catch(err){
        console.log(err)
    }
})

module.exports = router;