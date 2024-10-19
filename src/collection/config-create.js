const mongoose = require("mongoose");
const createSchema = new mongoose.Schema({
    creator:{
        type: String,
    },
    titel:{
        type: String,
    },
    timestamp:{
        type: Number,
    },
    biter:{
        type: String,
    },
    bithistory:{
        type: Array,
    },
    description:{
        type: String,
    },
    startbit:{
        type: Number,
    },
    categorique:{
        type: String,
    },
    status:{
        type: Number,
    },
    img:{
        type: Array,
    
    }
});

const collection = new mongoose.model("create",createSchema);
module.exports = collection;