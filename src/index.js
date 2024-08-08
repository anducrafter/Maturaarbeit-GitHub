const express = require("express");
const bycript = require("bcrypt");
const collection = require("./config");
const multer = require('multer');
const imgcollection = require("./config-img")
const auctioncollection = require("./config-create")
const path = require('path');
const fs = require('fs');
const nodemailer = require("nodemailer");
const session = require("express-session");
const { sign } = require("crypto");
const cookieParser = require('cookie-parser');

const app = express();


//Bild hochladen

const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, uploadDir);
    },
    filename: (req,file,cb) =>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });

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

//habe es mal rausgenommen wegen dem css
//app.use(express.static("public"));



app.use(express.urlencoded({ extended: false }));


const usermanager = []


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




app.get("/au/:id", async (req,res) =>{
   
    try{

        
        const auction =  await auctioncollection.findOne({_id: req.params.id});
        res.render('auction', { auction: auction, id: req.params.id, login : req.session.user });
        
    }catch(err){
        console.log(err)
    }
    
})

app.get("/dashboard/:type", isAuthenticated, async (req,res) =>{
   
    try{

        const user = await collection.findOne({name: req.session.user})
        const time = new Date().getTime();
        const createauction = user.create;
        const userauctions = user.auctions;
        if(req.params.type == "offers"){
            const auction = await auctioncollection.find({_id: {$in : userauctions}, timestamp: {$gt: time}});
          
            res.render('dashboard/user/userauction', { auctions: auction, type :req.params.type , login : req.session.user});

          
        }else if (req.params.type == "wins"){
            const auction = await auctioncollection.find({_id: {$in : userauctions}, biter: req.session.user, timestamp: {$lt: time}});
            console.log("tesrt 1");
            res.render('dashboard/user/userwinauction', { auctions: auction, type: req.params.type, login : req.session.user});

        }else if( req.params.type == "auctions"){
            const auction = await auctioncollection.find({_id: {$in : createauction}, timestamp: {$gt: time}});
            res.render('dashboard/creator/creatorauction', { auctions: auction, type: req.params.type, login : req.session.user});

        }else if( req.params.type == "sell"){
            const auction = await auctioncollection.find({_id: {$in : createauction}, timestamp: {$lt: time}});
            res.render('dashboard/creator/creatorwinauction', { auctions: auction, type: req.params.type, login : req.session.user});
        }
     
        
    }catch(err){
        console.log(err)
    }
    
})

app.get("/dashboard/u/aufinish/:id",async (req,res) =>{
   
    try{

        
        const auction = await auctioncollection.findOne({_id: req.params.id});
       
        const date = new Date();
        if(auction.biter != req.session.user && auction.timestamp < date.getTime()) {
            const auction =  await auctioncollection.find({});
            res.render("index",{auctions: auction})
        }
        const creator = await collection.findOne({name: auction.creator})
        res.render('dashboard/user/userauctionfinish', { auctions: auction,creator: creator, login : req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})

app.get("/dashboard/c/aufinish/:id",async (req,res) =>{
   
    try{

        
        const auction = await auctioncollection.findOne({_id: req.params.id});
       
        const date = new Date();
        if(auction.creator != req.session.user && auction.timestamp < date.getTime()) {
            const auction =  await auctioncollection.find({});
            res.render("index",{auctions: auction})
        }
        const buyer = await collection.findOne({name: auction.biter})
        console.log(buyer)
        res.render('dashboard/creator/creatorauctionfinish', { auctions: auction,buyer: buyer, login : req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})

app.get("/category/:id",async (req,res) =>{
   
    try{
        const auction = await auctioncollection.find({categorique: req.params.id});
       
        res.render('category', { auctions: auction , login : req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})


app.get("/",  loadAuthenticated, async (req, res) => {
  /*  try {
      const images = await imgcollection.find({});
      res.render('index', { images: images });
    } catch (err) {
      console.log(err);
      res.status(500).send('Serverfehler');
    }
  });*/

  //Dieses zeug hier hat funktioniert also 
  
 // try{
  /*
   const auction = await auctioncollection.find({});
   const imagess = []
   auction.forEach(element => {
   imagess.push(element.img);
   });
    console.log("test",auction[0].description);
   // res.render('index', { images: imagess });
   res.render('index', { auctions: auction });
  }catch(err){
    console.log(err)
  }
  */

  try{
  const auction =  await auctioncollection.find({});
 
  console.log(req.session.user);
   res.render('index', { auctions: auction, login : req.session.user});
}catch(err){
    console.log(err)
}

});



app.get("/login", (req,res) =>{
    res.render("login", {login : req.session.user});
})

app.get("/register", (req,res) =>{
    res.render("sign",{login : req.session.user});
})

app.get("/create", (req,res) =>{
    res.render("uploade",{login : req.session.user});
})

//Ist ein proversorium um css zu laden
app.get("/src/public/css/:id",(req,res) =>{
    fs.readFile(__dirname + '/public/css/'+req.params.id, function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });
      
})


function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else if(req.cookies.login != null) {
         
        req.session.user = JSON.parse(req.cookies.login)
        console.log(req.session.user)
        return next();
    }else{
        res.redirect('/login');
    }
}

function loadAuthenticated(req, res, next) {
    if (req.session.user) {
       
    } else if(req.cookies.login != null) {
         
        req.session.user = JSON.parse(req.cookies.login)
        console.log(req.session.user)
        
    }
    return next();
}

app.post("/dashboard/u/aufinish/:id", isAuthenticated , async(req,res) =>{
    const auction =  await auctioncollection.findOne({_id: req.params.id});
    let status = auction.status;
    if(status == 4){
      console.log("Auktion schon abgeschlossen");
      return;  
    }
    if(status == 2){

        console.log("Auktion muss lieferant fertig");
        return;
    }

    status++;
    await auctioncollection.updateOne({_id: req.params.id},{$set: {status: status}})
    res.redirect("dashboard/user/userauctionfinish/"+req.params.id)

});

app.post("/dashboard/c/aufinish/:id", isAuthenticated , async(req,res) =>{
    const auction =  await auctioncollection.findOne({_id: req.params.id});
    let status = auction.status;
    if(status == 4){
      console.log("Auktion schon abgeschlossen");
      return;  
    }
    if(status != 2){
        console.log("Auktion muss lieferant fertig");
        return;
    }

    status++;
    await auctioncollection.updateOne({_id: req.params.id},{$set: {status: status}})
    res.redirect("/dashboard/c/aufinish"+req.params.id);

});
app.post("/au/:id", isAuthenticated, async(req,res) =>{
    
    try{
       const auction =  await auctioncollection.findOne({_id: req.params.id});
       if(auction.timestamp <= Date.now()){ res.send("auction schon vorbei"); return;}
       
     const bit = auction.startbit;
     const newbit = req.body.newbit;
 
   if(newbit > bit){
    const biter =  auction.biter;
    const newbiter = req.session.user;
    const history = auction.bithistory;
    history.push({name: req.session.user, bit: newbit})
    
    if(auction.timestamp <= Date.now()+300000){
       auction.timestamp+= 180000; //füge noch 3 Minuten hinzu
    }
       const auctionupdate = await auctioncollection.updateOne({_id: req.params.id},{$set: {startbit: newbit, biter: newbiter, bithistory: history, timestamp: auction.timestamp}})
       const user = await collection.findOne({name: req.session.user})
       const at  =user.auctions;
     if(at == ""){
        at.push(req.params.id);
     }else if(!at.includes(req.params.id)){
        at.push(req.params.id);
        console.log("tesrt 1")
     }

     console.log(at)
      await collection.updateOne({name: req.session.user}, {$set : {auctions:  at}})
       res.redirect("/au/"+ req.params.id)
   }
   
   
   }catch(err){
   console.log(err)
   }
   
});

app.post("/create",  upload.single("image"),isAuthenticated,async (req,res) =>{
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
        const datee = new Date();
        
       // days now in minutes aution.timestamp = date.getTime()+1000 * 60 * 60 * 24 *data.time;
         aution.timestamp = datee.getTime()+1000 * 60 * data.time;
        aution.biter = "";
//        console.log(path.join(uploadDir, req.file.filename))
  //      console.log(req.file.filename);
        //Das hier war noch mit mongodb die bildern
    //    aution.img.data = fs.readFileSync(path.join(uploadDir, req.file.filename));
        aution.img.push(req.file.filename);


        aution.save().then(() =>{
        //   await  collection.updateOne({name: req.session.user}, {$set : {create: userauction}})
        }).catch((err) =>{
            console.log(err);
            console.log("Fehler beim Auction in databank Speichern")
        })
        const user =   await collection.findOne({name: req.session.user});
        let userauction;
        if(user.create != null ? userauction = user.create : userauction = []);
       
        
         userauction.push(aution._id);
         await  collection.updateOne({name: req.session.user}, {$set : {create: userauction}})
      //   await collection.updateOne({name: req.session.user}, {$set : {auctions:  at}})
        //Save now open auction in database
       
    }catch(err){
        console.log(err)
    }
   
    
  
})



//Regestrieren
app.post("/register",async (req,res) =>{
    try {
       
    const data = {
        name: req.body.username,
        password: req.body.password,
        email: req.body.email,
        auctions: new Array(),
        create: new Array(),
        bewertung: 5

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
app.get("/test" , async(req,res) =>{
res.render("test", {gaming: "gaming"});
})

app.post("/" , async (req, res) =>{

    const search = req.body.search;
    const auction = await auctioncollection.find({titel: { $regex: "(?i)(.*" + search + ".*)"}});
    console.log(auction)
    res.render('search', { auctions: auction, login :  req.session.user });
});

//Login
app.post("/login" ,async (req,res) =>{
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
            req.session.user = haseduser;
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



const port = 5000
app.listen(port, () =>{
  
    console.log('Server is running on Port:',port);
    sendMail(transporter,mailOption)
})