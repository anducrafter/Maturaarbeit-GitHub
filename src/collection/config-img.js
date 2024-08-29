const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/img")

connect.then(() =>{
    console.log("Database erfolgreich connectred")
}).catch(() =>{
    console.log("Database nicht connected");
})

const UserEvaluate = new mongoose.Schema({
    name:{
        type: String,
    },
    text:{
    type: String,
   
    },
    evaluate:{
        type: Number
    },
    date:{
        type: Date
    }

});

const collection = new mongoose.model("UserEvaluate",UserEvaluate);
module.exports = collection;