const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");


router.get("/s/:id", async (req,res) =>{
   
    try{

        let query = req.query;
       
        if (Object.keys(req.query).length === 0){
            query = "";
        }else {
          query = "?"+req.originalUrl.split('?')[1];
        }
        const search = req.query.search;
        const maxprice = req.query.price;
        const user =  await collection.findOne({name: req.session.user}) || false
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12
        const startIndex = (page - 1) * limit;
        const lenght = await auctioncollection.countDocuments() / limit;
        const searchFilter = { };
        let sort;
        if (req.params.id) {
         searchFilter.categorique = req.params.id;
       } 
       if(search){
       console.log(query.search,  search)
        searchFilter.titel =  { $regex: "(?i)(.*" + search + ".*)" }
       }       

       if(req.query.sort){
        sort = {startbit: Number(req.query.sort)}
       }
       
       const maxPriceProduct = await auctioncollection
      .find(searchFilter, { startbit: 1 })   // Nur das 'price'-Feld zurückgeben
      .sort({ startbit: -1 })                // Nach Preis absteigend sortieren
      .limit(1);    
                            // Nur das teuerste Produkt zurückgeben
      if(maxprice){
        searchFilter.startbit = {$lte :maxprice};
       }
       // Zugriff auf den maximalen Preis
       let maxPrice;
       if( maxPriceProduct[0] != undefined){
            maxPrice =  maxPriceProduct[0].startbit ;
       } 
      
       console.log(maxPrice,maxPriceProduct[0])
       const price = { }
       price.price = req.query.price;
       price.max = maxPrice;
       const auction = await auctioncollection.find(searchFilter).skip(startIndex).limit(limit).sort(sort);
       
       res.render('category', { auctions: auction , login : req.session.user, query : query, user: user, lenght : lenght, suchen: true, price : price});
        
    }catch(err){
        console.log(err)
    }
    
})

module.exports = router;