const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");


router.get("/s/:id?", async (req,res) =>{
   
    try{

        const search = req.query.search;
        const maxprice = req.query.price;
        const user =  await collection.findOne({name: req.session.user}) || false
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12
        const startIndex = (page - 1) * limit;
        const searchFilter = { };
        let sort; 
        //produkte max cost
       const maxPriceProduct = await auctioncollection
      .find(searchFilter, { startbit: 1 })   // Nur das 'price'-Feld zurückgeben
      .sort({ startbit: -1 })                // Nach Preis absteigend sortieren
      .limit(1);    
                          
      const lenght = maxPriceProduct.lenght / limit || 0;

      if (req.params.id) {
        searchFilter.categorique = req.params.id;
      } 
      if(search){
        //Man könnte anstat von Regex auch die option von MongoDB direkt benutzen. 
       searchFilter.titel =  { $regex: "(?i)(.*" + search + ".*)" }
      }       

      if(req.query.sort){
       sort = {startbit: Number(req.query.sort)}
      }

      if(maxprice){
        searchFilter.startbit = {$lte :maxprice};
       }
       
       // Zugriff auf den maximalen Preis
       let maxPrice;
       if( maxPriceProduct[0] != undefined){
            maxPrice =  maxPriceProduct[0].startbit ;
       } 
       //Hier sollten es nur 30 sekunden sein.
       const mintime = Date.now() + 1000* 0.5;
       searchFilter.timestamp = {$gt: mintime};
       const price = { }
       price.price = req.query.price;
       price.max = maxPrice;
       const auction = await auctioncollection.find(searchFilter).skip(startIndex).limit(limit).sort(sort);
      
       const queryString = "?"+ new URLSearchParams(req.query).toString();
       res.render('category', { auctions: auction , login : req.session.user, query : queryString, user: user, lenght : lenght, suchen: true, price : price});
        
    }catch(err){
        console.log(err)
    }
    
})

module.exports = router;