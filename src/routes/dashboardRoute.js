const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const evaluatecollection = require("../collection/config-img");
router.get("/dashboard/:type", auth.isAuthenticated, async (req,res) =>{
   
    try{

        const user = await collection.findOne({name: req.session.user})
        const time = new Date().getTime();
        console.log(user.create)
        const createauction = user.create || [];
        const userauctions = user.auctions || [];
        if(req.params.type == "offers"){
            const auction = await auctioncollection.find({_id: {$in : userauctions}, timestamp: {$gt: time}});
            res.render('dashboard/user/userauction', { auctions: auction, type :req.params.type , login : req.session.user, user: user});
        }else if (req.params.type == "wins"){
            const auction = await auctioncollection.find({_id: {$in : userauctions}, biter: req.session.user, timestamp: {$lt: time}});
            console.log("tesrt 1");
            res.render('dashboard/user/userwinauction', { auctions: auction, type: req.params.type, login : req.session.user, user: user});

        }else if( req.params.type == "auctions"){
            const auction = await auctioncollection.find({_id: {$in : createauction}, timestamp: {$gt: time}});
            res.render('dashboard/creator/creatorauction', { auctions: auction, type: req.params.type, login : req.session.user, user: user});

        }else if( req.params.type == "sell"){
            const auction = await auctioncollection.find({_id: {$in : createauction}, timestamp: {$lt: time}});
            res.render('dashboard/creator/creatorwinauction', { auctions: auction, type: req.params.type, login : req.session.user, user: user});
        }
     
        
    }catch(err){
        console.log(err)
    }
    
})

router.get("/dashboard/u/aufinish/:id", auth.isAuthenticated, async (req,res) =>{
   
    try{

        
        const auction = await auctioncollection.findOne({_id: req.params.id});
        const user = await collection.findOne({name: req.session.user})
      
        if(auction.biter != req.session.user && auction.timestamp < date.getTime()) {
            const auction =  await auctioncollection.find({});
            res.render("index",{auctions: auction})
        }
        const creator = await collection.findOne({name: auction.creator})
        res.render('dashboard/user/userauctionfinish', { auctions: auction,creator: creator, login : req.session.user, user : user});
        
    }catch(err){
        console.log(err)
    }
    
})

router.get("/dashboard/c/aufinish/:id", auth.isAuthenticated, async (req,res) =>{
   
    try{

        
        const auction = await auctioncollection.findOne({_id: req.params.id});
        const user = await collection.findOne({name: req.session.user})
        const date = new Date();
        if(auction.creator != req.session.user && auction.timestamp < date.getTime()) {
            const auction =  await auctioncollection.find({});
            res.render("index",{auctions: auction})
        }
        const buyer = await collection.findOne({name: auction.biter})
        console.log(buyer)
        res.render('dashboard/creator/creatorauctionfinish', { auctions: auction,buyer: buyer, login : req.session.user, user : user});
        
    }catch(err){
        console.log(err)
    }
    
})

router.post("/aufinish/u/:id", auth.isAuthenticated , async(req,res) =>{
    const auction =  await auctioncollection.findOne({_id: req.params.id});
    let status = auction.status;
    if(status != 1)return;

    status++;
    await auctioncollection.updateOne({_id: req.params.id},{$set: {status: status}})
   
    console.log(req.body.description, req.body.rating)
    const raiting = {
       name: auction.creator, 
       text: req.body.description,
       evaluate : req.body.rating,
       date: Date.now()

    }
    await evaluatecollection.insertMany(raiting);
    res.redirect("/dashboard/u/aufinish/"+req.params.id)

});

router.post("/aufinish/c/:id", auth.isAuthenticated , async(req,res) =>{
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
    res.redirect("/dashboard/c/aufinish/"+req.params.id);

});

module.exports = router;

