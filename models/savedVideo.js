const mongoose =  require("mongoose");

const savedVideoSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    Videoid:{
        type:mongoose.Schema.ObjectId,
        ref:"Video" 
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
module.exports = mongoose.model("savedVideo", savedVideoSchema);