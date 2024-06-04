const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/img")

connect.then(() =>{
    console.log("Database erfolgreich connectred")
}).catch(() =>{
    console.log("Database nicht connected");
})

const ImgSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    img:{
    data: Buffer,
    contentType: String,
   
    }
});

const collection = new mongoose.model("Image",ImgSchema);
module.exports = collection;