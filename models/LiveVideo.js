const mongoose = require("mongoose");

const liveVideoSchema = new mongoose.Schema({
    organiser:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true,
        trim: true,
    }, 
    roomid:{
        type:String,
        required:true,
        unique:true,
        trim: true,
    },
    description:{
        type:String,
        required:true,
        trim: true,
    }, 
    visibility:{
        type:String,
        default:"public"
    },
    accessibility:[{type:String}],  
    createdAt:{
        type:Date,
        default:Date.now
    },
    participants:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
})
module.exports = mongoose.model("LiveVideo", liveVideoSchema);