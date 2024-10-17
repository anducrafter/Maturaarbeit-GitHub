const express=require("express");
const router=express.Router();
const collection = require("../collection/config");
const evaluatecollection = require("../collection/config-img");
const auth = require("../public/javascript/auth");


router.get("/userlist", auth.isAdmin, async (req,res) =>{
    try{
        const user =  await collection.findOne({name: req.session.user});
        const users =  await collection.find({});
        res.render('administrator/userlist', {users: users, user: user, login: req.session.user});
        
    }catch(err){
        console.log(err)
    }
    
})

router.post("/userlist",async (req,res) =>{

    const user = {}
    user.name = req.body.userName;
   await collection.deleteOne(user);
   console.log("User wurde gelöscht: ",user.name)
   res.redirect("/userlist")
});
module.exports = router;