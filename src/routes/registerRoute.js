const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const bycript = require("bcryptjs");
const flash = require("express-flash")
const formData = require('form-data');
require('dotenv').config();

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID);

router.get("/register", async (req,res) =>{
      const user =  await collection.find({name: req.session.user}) || false
    res.render("sign", {login : req.session.user, user: user,message : req.flash()});
})


function generateRandomID() {
    let id = '';
    for (let i = 0; i < 15; i++) {
        id += Math.floor(Math.random() * 10); // Zufällige Ziffer (0-9) hinzufügen
    }
    return Number(id); // Den String in eine Zahl umwandeln
}

router.post("/register",async (req,res) =>{
    
    try {   
    const id = generateRandomID();
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
        verify : false,
        verifyid: id

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
    //sende mail mit sendGrid datum 18.10.24 letzes versuch
    //wuste doch, das es mit Zeitdruck an ende geht xD
    console.log(id, data.verifyid);
    res.render("mails/registermail", { name: data.name, id: id  }, async (err, html) => {
        if (err) {
            console.error('Error rendering HTML template:', err);
            res.status(500).send('Fehler beim Rendern der E-Mail-Vorlage.');
            return;
        }

        // Optionen für die E-Mail
        const msg = {
            from: 'Repli.ch <admin@repli.ch>', // Absender
            to: data.email, // Empfänger der E-Mail
            subject: 'Repli.ch, Email Bestätigung',
            text: 'Registrieren für Repli', // Plaintext-Version der E-Mail
            html: html // Hier fügen wir das gerenderte HTML hinzu
        };

        try {
            // E-Mail senden
            sgMail.send(msg);
            console.log('email erfolgreich gesendet hoffe ich xD');
          
        } catch (error) {
            console.error('Error sending email:', error);
           
        }
    });

    req.flash("success","Email wurde erfolgreich verschickt, bitte bestätigen Sie diese");
    return res.redirect("/register");
   
}catch(err){
    console.log(err)
   
}



});

module.exports = router;