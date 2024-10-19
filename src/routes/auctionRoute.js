const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");

router.get("/au/:id", async (req,res) =>{
   
    try{
        const auction =  await auctioncollection.findOne({_id: req.params.id});
        const user = await collection.findOne({name: req.session.user}) || false
        const creator = await collection.findOne({name: auction.creator});
        const queryString = "?"+ new URLSearchParams(req.query).toString();
        res.render('auction', { auction: auction, id: req.params.id, creator: creator , login : req.session.user , query : queryString, user: user, API: process.env.API, suchen: false});
        
    }catch(err){
        console.log(err)
    }
    
})

router.post("/au/:id", auth.isAuthenticated, async(req,res) =>{
    
    try{
       const auction =  await auctioncollection.findOne({_id: req.params.id});
       if(auction.timestamp <= Date.now()){ 
        res.redirect("/au/"+ req.params.id)
        return;}

       
     const bit = auction.startbit;
     const newbit = req.body.newbit;
 
     if(auction.creator = req.session.user){
        //Man selber kann nicht draufbieten
       return res.redirect("/au/"+ req.params.id)
     }
   if(newbit > bit){
    const newbiter = req.session.user;
    const history = auction.bithistory;
    history.push({name: req.session.user, bit: newbit})
    
    if(auction.timestamp <= Date.now()+300000){
       auction.timestamp+= 180000; //füge noch 3 Minuten hinzu
    }
       await auctioncollection.updateOne({_id: req.params.id},{$set: {startbit: newbit, biter: newbiter, bithistory: history, timestamp: auction.timestamp}})
       const user = await collection.findOne({name: req.session.user})
       const at  =user.auctions;
    if(!at.includes(req.params.id)){
        at.push(req.params.id);
     }
      await collection.updateOne({name: req.session.user}, {$set : {auctions:  at}})
       res.redirect("/au/"+ req.params.id)
   }
   
   
   }catch(err){
   console.log(err)
   }
   
});

module.exports = router;