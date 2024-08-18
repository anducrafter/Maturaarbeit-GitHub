const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");

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


router.get("/",  loadAuthenticated, async (req, res) => {
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
      let query = req.query;
     
     if (Object.keys(req.query).length === 0){
          query = "";
      }
      const user =  await collection.findOne({name: req.session.user}) || false
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12
      const startIndex = (page - 1) * limit;
      const auction =  await auctioncollection.find({}).skip(startIndex).limit(limit);
      const lenght = await auctioncollection.countDocuments() / limit;
      console.log(req.session.user)
      console.log(user)
      console.log(user.img)
     res.render('index', { auctions: auction, login : req.session.user, query : query, user: user, lenght: lenght});
  }catch(err){
      console.log(err)
  }
  
  });
  


  router.post("/" , async (req, res) =>{

    const search = req.body.search;
   /* const auction = await auctioncollection.find({titel: { $regex: "(?i)(.*" + search + ".*)"}});
    
    res.render('search', { auctions: auction, login :  req.session.user, query : req.query}); */
    res.redirect("/s/ALL"+"?search="+search);
});
module.exports = router;