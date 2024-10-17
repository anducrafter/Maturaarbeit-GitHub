
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/User")

//Localhost geht nicht :( hat mich ne hable stunde gekostet xD # (30.8.24 rückblickend nach 3 Monaten ist eine halbe Stunde gar nicht viel.)
//Database muss mit 127.0.0.1 connected werden
//wieso weiss ich  gar nicht. 
connect.then(() =>{
    console.log("Database erfolgreich connectred")
}).catch(() =>{
    console.log("Database nicht connected");
})

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
     admin:{
        type:Boolean,
     }
});


const collection = new mongoose.model("User",LoginShema);
module.exports = collection;