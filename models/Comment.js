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
  replyCount:{
    type:Number,
    default:0
  },
  likesCount:{
    type:Number,
    default:0
  },
  dislikesCount:{
    type:Number,
    default:0
  },
  Repliedto:{
    type:mongoose.Schema.ObjectId,
                  //if it is not blank
                  // we will know that it is not an original comment
    ref:"Comment",
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", CommentSchema);