const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const nodemailer = require("nodemailer");
const bycript = require("bcryptjs");

router.get("/register", (req,res) =>{
    res.render("sign",{login : req.session.user});
})

let transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25, // Port for submission with TLS
    secure: false, // false for port 587
    tls: {
        rejectUnauthorized: false // Ignore self-signed certificate
    }
});

  const sendMail = async (transporter,mailOption) =>{
    try{
        await transporter.sendMail(mailOption);
        console.log("Email sended succecfully")
    }catch (err){
        console.log(err)
    }
  }


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
        img: "",
        verify : false

    }
   const username = await collection.findOne({name: data.name})
   const email = await collection.findOne({email: data.email})
   if(username || email ){
    res.send("Bitte gib ein anderen username oder passwort an")
   }else{
    const hasedPassword = await bycript.hash(data.password,9);
    data.password = hasedPassword;
    const userdata = await collection.insertMany(data);
    res.render("mails/registermail", {name: data.email}, async (err, html )=>{
        if(err){
            res.status(303);
            return;
        }
        let mailOption = {
            from: 'Repli.ch  <administrator@repli.ch>',
            to: "andusucht@gmail.com",
            subject: "Repli.ch, Email Bestätigung",
            text: "Regestrieren für Repli",
            html: html
          }

          sendMail(transporter,mailOption)
          res.status(500).send({message: "Email wurde verschickt, bitte Bestätigen"})
    });
   
   }
   
}catch(err){
    console.log(err)
   
}

});

module.exports = router;