const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    reporter:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    VideoId:{
        type:mongoose.Schema.ObjectId,
        ref:"Video",
        required:true,
    }
})
module.exports = mongoose.model("Report", ReportSchema);