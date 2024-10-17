const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");




router.get("/",  auth.loadAuthenticated, async (req, res) => {
    try{
     
      const user =  await collection.findOne({name: req.session.user}) || false
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12
      const startIndex = (page - 1) * limit;
      const mintime = Date.now() + 1000* 1;
      //Gibt die neusten Auktionen an.
      const sort =  {_id: -1}
      const auction =  await auctioncollection.find({timestamp: {$gt: mintime}}).skip(startIndex).limit(limit).sort(sort);
      const lenght = await auctioncollection.countDocuments() / limit;
      const queryString = "?"+ new URLSearchParams(req.query).toString();
     res.render('index', { auctions: auction, login : req.session.user, query : queryString, user: user, lenght: lenght, suchen: false});
  }catch(err){
      console.log(err)
  }
  
  });
  


  router.post("/" , async (req, res) =>{
    
    const search = req.body.search;
    res.redirect("/s/"+"?search="+search);
});
module.exports = router;