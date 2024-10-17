const express = require("express");
const fs = require('fs');
const nodemailer = require("nodemailer");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require("express-flash")
//rooters
const indexroot = require("./routes/indexRoute")
const auctionroute = require("./routes/auctionRoute")
const auctioneditroute = require("./routes/auctionEditRoute")
const profileRoute = require("./routes/profileRoute")
const dashboardroute = require("./routes/dashboardRoute")
const searchroute = require("./routes/searchRoute")
const loginroute = require("./routes/loginRoute")
const registerroute = require("./routes/registerRoute")
const createroute = require("./routes/createRoute")
const userroute = require("./routes/userRoute")
const userlistroute = require("./routes/userlistRoute.js");
const googleroute = require("./routes/googleApi.js");
//load the  .env Datei

const app = express();


app.use(session({
    secret: "dasjklekjld",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
})); 

//Viw engine test


app.set("view engine","ejs")
app.set('views', path.join(__dirname, '..', 'views'))
//Daten werdfen in Json übergeben

app.use(express.json());
app.use(flash())


app.use(express.urlencoded({ extended: false }));

//Wieso geht das ned ?
app.use( express.static(path.join(__dirname, 'public')));


//Node emailer
const transporter = nodemailer.createTransport({
    //service: "gmail",
    host: "smtp.freesmtpservers.com",
    port: 25,
    secure: false, // Use `true` for port 465, `false` for all other ports
   
  });

  const mailOption = {
    from: {
        name: "anducrafter",
        address: "buisnesserwan@gmail.com"
    },
    to: "andusucht@gmail.com",
    subject: "Hello how are you?",
    text: "Hello world",
    html: "<h1> My fist sending email </h1>"
  }

  const sendMail = async (transporter,mailOption) =>{
    try{
        await transporter.sendMail(mailOption);
        console.log("Email sended succecfully")
    }catch (err){
        console.log(err)
    }
  }
  app.use(cookieParser());
  
  //Now add the Rooters

  app.use("/",indexroot)
  app.use("/",auctionroute)
  app.use("/",auctioneditroute)
  app.use("/",profileRoute)
  app.use("/",dashboardroute)
  app.use("/",searchroute)
  app.use("/", loginroute)
  app.use("/",registerroute)
  app.use("/",createroute)
  app.use("/",userroute)
  app.use("/",userlistroute)
  app.use("/",googleroute)

app.get("/test" , async(req,res) =>{
res.render("test", {gaming: "gaming"});
})


const port = 5000
app.listen(port, () =>{
  
    console.log('Server is running on Port:',port);
   
})