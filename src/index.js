const express = require("express");
const bycript = require("bcrypt");
const collection = require("./config");
const multer = require('multer');
const imgcollection = require("./config-img")
const auctioncollection = require("./config-create")
const path = require('path');
const fs = require('fs');
const session = require("express-session");
const { sign } = require("crypto");


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
app.use(express.static(path.join(__dirname+ "/public/css/sign.css")));


app.get("/au/:id",async (req,res) =>{
   
    try{

        const auction = await auctioncollection.find({uuid: req.params.id});
        res.render('auction', { auctions: auction, id: req.params.id });
        
    }catch(err){
        console.log(err)
    }
    
})


app.get("/", async (req, res) => {
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
  const auction = await auctioncollection.find({});
 
   res.render('index', { auctions: auction });
}catch(err){
    console.log(err)
}

});



app.get("/login", (req,res) =>{
    res.render("login");
})

app.get("/register", (req,res) =>{
    res.render("sign");
})

app.get("/create", (req,res) =>{
    res.render("uploade");
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
    } else {
        res.redirect('/login');
        console.log("naa wieso geht der scheiss nd")
    }
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

app.post("/au/:id", isAuthenticated, async(req,res) =>{
    
    try{
       const auction =  await auctioncollection.findOne({uuid: req.params.id});
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
       const auctionupdate = await auctioncollection.updateOne({uuid: req.params.id},{$set: {startbit: newbit, biter: newbiter, bithistory: history, timestamp: auction.timestamp}})
       const user = await collection.findOne({name: req.session.user})
      const userauction =  user.auctions;
      if(!userauction.get(req.params.id)){
      userauction.push(req.params.id)}
      
      await collection.updateOne({name: req.session.user}, {$set : {auctions: userauction}})
       res.redirect("/au/"+ req.params.id)
   }
   
   
   }catch(err){
   console.log(err)
   }
   
});
app.post("/create",  upload.single("image"),isAuthenticated, async (req,res) =>{
    try {
        //Save image in database
        const data = {
            startbit: req.body.startbit,
            titel: req.body.titel,
            description: req.body.description,
            time: req.body.time
        }
        const aution = new auctioncollection();
        aution.uuid = uuidv4();
        aution.titel = data.titel;
        aution.description = data.description;
        aution.startbit = data.startbit;
        aution.creator = req.session.user;
        aution.bithistory = []
        aution.categorique = []
        const date = new Date();
        
        aution.timestamp = date.getTime()+1000 * 60 * 60 * 24 *data.time;
        aution.biter = "";
        aution.img.data = fs.readFileSync(path.join(uploadDir, req.file.filename));
        aution.img.contentType = "imga/png";


        aution.save().then(() =>{
           
            const user =  collection.findOne({name: req.session.user})
            const userauction =  user.create
            userauction.push(aution.uuid);
            
             collection.updateOne({name: req.session.user}, {$set : {create: userauction}})
             console.log(userauction);
        }).catch((err) =>{
            console.log(err);
            console.log("Fehler beim Auction in databank Speichern")
        })
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
        auctions: obj ,
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
           
            req.session.user = user.name;
            res.redirect("/")
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
})