const express = require("express");
const fs = require('fs');
const nodemailer = require("nodemailer");
const session = require("express-session");
const cookieParser = require('cookie-parser');

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

const app = express();


app.use(session({
    secret: "dasjklekjld",
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
})); 

//Viw engine test


app.set("view engine","ejs")

//Daten werdfen in Json übergeben

app.use(express.json());


app.use(express.urlencoded({ extended: false }));

//Wieso geht das ned ?
app.use(express.static('src/public'));


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


/*
app.get("/category/:id",async (req,res) =>{
   
    try{
        const auction = await auctioncollection.find({categorique: req.params.id});
       
        res.render('category', { auctions: auction , login : req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})*/


//Ist ein proversorium um css zu laden
app.get("/src/public/css/:id",(req,res) =>{
    fs.readFile(__dirname + '/public/css/'+req.params.id, function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
      
})

app.get("/test" , async(req,res) =>{
res.render("test", {gaming: "gaming"});
})


const port = 5000
app.listen(port, () =>{
  
    console.log('Server is running on Port:',port);
    sendMail(transporter,mailOption)
})