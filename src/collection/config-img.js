const mongoose = require("mongoose");
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