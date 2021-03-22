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
    postId:{
        type:mongoose.Schema.ObjectId,
        ref:"Post"
    }
})
module.exports = mongoose.model("Report", ReportSchema);