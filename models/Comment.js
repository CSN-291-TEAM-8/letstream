const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  Video: {
    type: mongoose.Schema.ObjectId,
    ref: "Video",
    required: true,
  },
  text: {
    type: String,
    required: [true, "Please enter the comment"],
    trim: true,
  },  
  likesCount:{
    type:Number,
    default:0
  },
  likedBy:[{
    type: mongoose.Schema.ObjectId,   
  }],
  dislikedBy: [{
    type: mongoose.Schema.ObjectId,        
  }],
  dislikesCount:{
    type:Number,
    default:0
  },
  Repliedto:{
    type:String                  //if it is not blank
                  // we will know that it is not a reply to a comment   
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);