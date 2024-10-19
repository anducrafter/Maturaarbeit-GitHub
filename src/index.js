const express = require("express");
const fs = require('fs');
const nodemailer = require("nodemailer");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const path = require('path');
const flash = require("express-flash")
const mongoose = require("mongoose");
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
const app = express();
//load the  .env Datei




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

//Wieso geht das ned ? //geht nun
app.use( express.static(path.join(__dirname, 'public')));

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

const port = 5000
app.listen(port, () =>{
    //connect to MognodB
    //connect zur MongoDB


//Localhost geht nicht :( hat mich ne hable stunde gekostet xD # (30.8.24 rückblickend nach 3 Monaten ist eine halbe Stunde gar nicht viel.)
//Database muss mit 127.0.0.1 connected werden
    const connect = mongoose.connect("mongodb://127.0.0.1:27017/Repli")
    connect.then(() =>{
        console.log("Database erfolgreich connectred")
    }).catch(() =>{
        console.log("Database nicht connected");
    })
    console.log("Repli.ch")
    console.log('Server is running on Port:',port);
})