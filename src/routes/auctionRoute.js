const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");

router.get("/au/:id", async (req,res) =>{
   
    try{

      
        const auction =  await auctioncollection.findOne({_id: req.params.id});
        const user = await collection.findOne({name: req.session.user}) || false
        console.log(process.env.API)
        res.render('auction', { auction: auction, id: req.params.id, login : req.session.user , query : req.query, user: user, API: process.env.API});
        
    }catch(err){
        console.log(err)
    }
    
})

router.post("/au/:id", auth.isAuthenticated, async(req,res) =>{
    
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

module.exports = router;