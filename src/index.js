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

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));


const usermanager = []

app.get("/uploade",(req,res) =>{
   
    res.render("test")
})

app.get("/au/:id",async (req,res) =>{
   
    
    try{
        const auction = await auctioncollection.find({uuid: req.params.id});
        
        res.render('index', { auctions: auction });
        console.log("tset")
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
 
   res.render('index copy', { auctions: auction });
}catch(err){
    console.log(err)
}

});


app.get("/home",isAuthenticated,(req,res) =>{
    res.render("home", {testid: req.session.user});
})

app.get("/login", (req,res) =>{
    res.render("login");
})

app.get("/register", (req,res) =>{
    res.render("sign");
})

app.get("/create", (req,res) =>{
    res.render("uploade");
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
app.post("/create", upload.single("image"), async (req,res) =>{
    try {
        //Save image in database
        const data = {
            startbit: req.body.startbit,
            titel: req.body.titel,
            description: req.body.description
        }

       
        const aution = new auctioncollection();
        aution.uuid = uuidv4();
        aution.titel = data.titel;
        aution.description = data.description
        aution.startbit = data.startbit
        console.log(aution.test)
        aution.img.data = fs.readFileSync(path.join(uploadDir, req.file.filename));
        aution.img.contentType = "imga/png";
     
       
        aution.save().then(() =>{
            console.log("Bild hochgleaden")
        }).catch((err) =>{
            console.log(err);
            console.log("wieso geht der scheiss ned")
        })
        //Save now open auction in database
      


       
    }catch(err){
        console.log(err)
    }
   
    
  
})

app.post("/uploade", upload.single("image"),(req,res) =>{

    console.log('Body:', req.body);
  console.log('File:', req.file);
    const imga = new imgcollection();
    imga.name = req.file.name;
    imga.img.data = fs.readFileSync(path.join(uploadDir, req.file.filename));
    imga.img.contentType = "imga/png";
    imga.save().then(() =>{
        console.log("Bild hochgleaden")
    }).catch((err) =>{
        console.log(err);
        console.log("wieso geht der scheiss ned")
    })
    res.send("Bilder hochgeladen")
})

//Regestrieren
app.post("/register",async (req,res) =>{
    try {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
   const existuser = await collection.findOne({name: data.name})
   if(existuser){
    res.send("Bitte andere Namen angeben")
   }else{
    const hasedPassword = await bycript.hash(data.password,9);
    data.password = hasedPassword;
    const userdata = await collection.insertMany(data);
    console.log(data)
    res.send("Erfolgreich User erstellt!")
   }
   
}catch(err){
    console.log(err)
    console
    .log("ERROR, wieso geht mongodb nicht?")
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
            res.redirect("home")
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


