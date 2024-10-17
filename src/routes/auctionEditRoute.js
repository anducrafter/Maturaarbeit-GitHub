const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const auctioncollection = require("../collection/config-create");
const auth = require("../public/javascript/auth");
const multer = require("../public/javascript/multer");
router.get("/au/edit/:id", auth.isAuthenticated, async (req,res) =>{
    try{
        const auction =  await auctioncollection.findOne({_id: req.params.id});

        if(auction.creator != req.session.user){
            res.redirect("/");
            return;
        }
        const user = await collection.findOne({name: req.session.user}) || false
        res.render('auctionedit', { auction: auction, id: req.params.id, login : req.session.user , user : user});
        
    }catch(err){
        console.log(err)
    }
    
})


router.post("/au/edit/:id",multer.upload, auth.isAuthenticated, async(req,res) =>{
    try{
       const auction =  await auctioncollection.findOne({_id: req.params.id});
       if(auction == undefined){
        res.redirect("/")
        return;
       }
       if(auction.creator != req.session.user){
        res.redirect("/")
        return;
       }
       if(auction.timestamp <= Date.now()){ 
        res.redirect("/")
        return;
       }
       let title = req.body.titel;
       let description = req.body.description;
       let categorique = req.body.categorique;
       let startbit = auction.startbit;
       let picture = []
       const files = req.files;
       req.files.forEach(img =>{
        picture.push(img.filename);
       })

       if(req.body.startbit != undefined){

        startbit = req.body.startbit;
       }
       let newimg = req.body.count;
       let oldpicture = auction.img;
       console.log(typeof newimg)
       console.log(newimg)

       if (typeof newimg === 'string') {
        try {
          newimg = JSON.parse(newimg); // Versuche, den JSON-String in ein Array zu konvertieren
        } catch (error) {
          console.error('Fehler beim Parsen von newimg:', error);
          newimg = []; // Fallback: Leeres Array
        }
      }
      newimg.sort((a, b) => {
        if (a === b) return 0
        if (a === null) return 1
        if (b === null) return -1
        return a - b
      })

       if(files && files.length > 0){
        newimg.forEach((index,count) =>{
            if(index <= oldpicture.length){
             oldpicture[index] = files[count].filename
            }else{
              oldpicture.push(files[count].filename)
            }
          })
    }   
     const asdfe =   await auctioncollection.updateOne({_id: req.params.id}, {$set : {titel: title, description: description,titel: title , startbit: startbit, img: oldpicture}});
       res.redirect("/au/"+req.params.id)
   }catch(err){
   console.log(err)
   }
   
});

module.exports = router;