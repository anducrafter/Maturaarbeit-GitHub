
const mongoose = require("mongoose");
const LoginShema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
       
     
    },
    auctions:{
        type: Array,
       
     
    },
    create:{
        type: Array,
       
     
    },
    bewertung:{
        type: Number,
       
     
    },
    password:{
        type:String,
   
    },
    about:{
        type:String,
   
    },

    phone:{
        type:Number,
       
     },
    address:{
        type:String,    

     },
     img:{
        type:String,    

     },
     verify:{
        type:Boolean,    

     },
     verifyid:{
        type:Number,    

     },
     admin:{
        type:Boolean,
     }
});


const collection = new mongoose.model("User",LoginShema);
module.exports = collection;