const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    description:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },//????? finding total time a video will run    
    url:{
        type:String,        
    },
    mimetype:{
        type:"String"
    },
    servername:{
        type:String,
       
    },    
    presenters:[{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }],
    views:{
        type:Number,
        default:0
    },
       viewedby:[{
            type:mongoose.Schema.ObjectId
       }],
      visibility:{
          type:String //either public,custom or sub-only
      },
      accessibility:[{type:String}],
    organiser:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    likesCount:{
        type:Number,
        default:0
    },
    keywords:{
        type:[String]
    },
    dislikesCount: {
        type: Number,
        default: 0,
      },
    likedBy:[{
        type: mongoose.Schema.ObjectId,   
    }],
    dislikedBy: [{
        type: mongoose.Schema.ObjectId,        
      }],
    comments:[{
        type: mongoose.Schema.ObjectId,
        ref:"Comment"
      }],
      reportCount:{
          type:Number,
          default:0
      },
    createdAt:{
        type:Date,
        default: Date.now
    }
});
VideoSchema.pre('remove', function(next) {
    this.model('Comment').deleteMany({ Video: this._id }, (err,res)=>{next(err)});
    this.model("Report").deleteMany({VideoId:this._id},(err,res)=>{next(err)});
    this.model("Notification").deleteMany({VideoId:this._id},(err,res)=>{next(err)});
    this.model("likedVideo").deleteMany({Videoid:this._id},(err,res)=>{next(err)});
    this.model("savedVideo").deleteMany({Videoid:this._id},(err,res)=>{next(err)});
});
module.exports = mongoose.model("Video", VideoSchema);