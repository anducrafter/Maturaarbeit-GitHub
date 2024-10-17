const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const nodemailer = require("nodemailer");
const bycript = require("bcryptjs");
const flash = require("express-flash")
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY || '245ccefc7c445161dc72fd0e8ec33c98-d010bdaf-b62f67b5'});

router.get("/register", async (req,res) =>{
      const user =  await collection.find({name: req.session.user}) || false
    res.render("sign", {login : req.session.user, user: user,message : req.flash()});
})

mg.messages.create('sandbox-123.mailgun.org', {
    from: "Excited User <mailgun@sandbox07facd8264e04e5fb639dad6db124c6a.mailgun.org>",
    to: ["andusucht@gmail.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>"
})
.then(msg => console.log(msg)) // logs response data
.catch(err => console.log(err)); // logs any error

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
        img: "default.jpg",
        verify : false

    }
   const username = await collection.findOne({name: data.name})
   const email = await collection.findOne({email: data.email})

   if(username || email ){
    req.flash("error","Die Email oder das Passwort werden schon benutzt");
    return res.redirect("/register");
   }
    const hasedPassword = await bycript.hash(data.password,9);
    data.password = hasedPassword;
    //Insert Benutzer in collection
    await collection.insertMany(data);
    mg.messages.create('sandbox-123.mailgun.org', {
        from: "Excited User <mailgun@sandbox07facd8264e04e5fb639dad6db124c6a.mailgun.org>",
        to: ["andusucht@gmail.com"],
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: "<h1>Testing some Mailgun awesomeness!</h1>"
    })
    .then(msg => console.log(msg)) // logs response data
    .catch(err => console.log(err));

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
    });

    req.flash("success","Email wurde erfolgreich verschickt, bitte bestätigen Sie diese");
    return res.redirect("/register");
   
}catch(err){
    console.log(err)
   
}



});

module.exports = router;