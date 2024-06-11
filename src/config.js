
const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/User")

//Localhost geht nicht :( hat mich ne hable stunde gekostet xD
//Database muss mit 127.0.0.1 connected werden
//wieso weiss ich auch gar nicht
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
        type: Object,
       
     
    },
    bewertung:{
        type: Number,
       
     
    },
    password:{
    type:String,
   
    }
});


const collection = new mongoose.model("User",LoginShema);
module.exports = collection;