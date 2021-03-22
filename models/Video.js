const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    description:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    poster:{
        type:String,
        required:true
    },
    presentors:[{type:mongoose.Schema.ObjectId,ref:"User"}],
    tags: {
        type: [String],
      },    
      visibility:{
          type:String //either public,custom or for subscribers only
      },
      accesibility:[{type:mongoose.Schema.ObjectId,ref:"User"}],
    organiser:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    likesCount:{
        type:Number,
        default:0
    },
    dislikesCount: {
        type: Number,
        default: 0,
      },
    createdAt:{
        type:Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Video", VideoSchema);