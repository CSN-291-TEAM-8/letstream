const User = require("../models/User");
const Video = require("../models/Video");
const Report = require("../models/Report");
const Notification = require("../models/Notification");
const fs = require("fs");
const Comment = require("../models/Comment");
const transporter = require("../utils/nodemailer");
const likedVideo = require("../models/likedVideo");
const savedVideo = require("../models/savedVideo");


exports.checkAccessibility = (req,video)=>{

    const organiser = await User.findById(video.oraganiser);

    return video.vis=="public"||video.oraganiser==req.user.id||video.presenters.indexOf(req.user.username)>-1||
    (video.vis=="sub-only"&&organiser.subscribers.toString().indexOf(req.user.id.toString())>-1)
    ||(video.vis=="custom"&&video.accessibility.indexOf(req.user.username)>-1)
}

exports.getvideo = async(req,res,next) =>{
    const vid = await Video.findById(req.params.id)
    .populate({
        path:"presenters",
        select:"username"
    })
    .lean()
    .exec();

    if(!vid){
        return next({
            statusCode:404,
            message:"This video is not found"
        })
    }
    

    if(!this.checkAccessibility(req,vid)){
        return next({
            statusCode:401,
            message:"You are not allowed to access this stream"
        })
    }
    const range = req.headers.range;
    if (!range) {
        return next({
            statusCode:401,
            message:"Requires range headers"
        })
    }
  
    
    const videoPath = `../uploads/${vid.url}`;
    const videoSize = fs.statSync(`../uploads/${vid.url}`).size;
  
    
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
  
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
  
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    videoStream.pipe(res);

}
exports.sendvideoinfo = async(req,res,next)=>{
    const v = await Video.findById(req.params.id).populate({
        path:"organiser",
        select:"username avatar"
    }).populate({
        path:"comments",
        select: "text createdAt",
        populate: {
        path: "user",
        select: "username avatar",
      },
    }).lean()
    .exec();
    if(!v||!this.checkAccessibility(req,v)){
        return next({
            statusCode:400,
            message:"The requested stream could not be fetched"
        })
    }
    v.isLiked = v.likedBy.includes(req.user.id);
    const isSaved = await savedVideo.findOne({userid:req.user.id,Videoid:v._id});
    if(isSaved){
        v.isSaved = true
    }
    else{
        v.isSaved = false;
    }
    v.comments.forEach(function(c){
        c.isMine = req.user.id==c.user._id.toString();
    })   
    res.status(200).json({success:true,data:v});

}
exports.deletevideo = async(req,res,next)=>{
    const video = await Video.findById(req.params.id);
    if(video.organiser==req.user.id){
        await video.remove();
        res.status(200).json({success:true,message:"Video deleted successfully"});
    }
    else{
        return next({
            statusCode:401,
            message:"Action failed"
        })
    }
}

exports.highlight = async(req,res,next) =>{
   const highlighedvideos =  await Video.find({}).sort((v)=>v.likesCount-v.dislikesCount);
   //select accessible videos
   const accessibleones = highlightedvideos.filter(function(v){
    return this.checkAccessibility(req,v);
   })
     
   res.status(200).json({success:true,accessibleones});

   }

exports.toggleLike = async(req,res,next) =>{
    const v = await Video.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if(!v||!user){
        return next({
            statusCode:404,
            message:"Action failed"
        })
    }
    if(!this.checkAccessibility(req,v)){
        return next({
            statusCode:401,
            message:"Unauthorised access"
        })
    }
    if(v.likedBy.indexOf(req.user.id)>-1){
        v.likesCount = v.likesCount - 1;
        v.likedBy.splice(v.likedBy.indexOf(req.user.id),1);
        await likedVideo.findOneAndDelete({userid:req.user.id,Videoid:v._id},(err,res)=>{
            console.log(err,"\n err on line 145 of controllers/video")
        });
    }
    else{
        v.likedBy.push(req.user.id);
        v.likesCount = v.likesCount + 1;
        await likedVideo.create({userid:req.user.id,Videoid:v._id})
    }
    if(v.dislikedBy.includes(req.user.id)){
        v.dislikedBy.splice(v.dislikedBy.indexOf(req.user.id),1);
        v.dislikesCount = v.dislikesCount - 1;
    }
    await v.save();
    res.status(200).json({success:true});
}

exports.toggledisLike = async(req,res,next) =>{
    const v = await Video.findById(req.params.id);
    if(!v){
        return next({
            statusCode:404,
            message:"Action failed"
        })
    }
    if(!this.checkAccessibility(req,v)){
        return next({
            statusCode:401,
            message:"Unauthorised access"
        })
    }
    if(v.dislikedBy.indexOf(req.user.id)>-1){
        v.dislikesCount = v.dislikesCount - 1;
        v.dislikedBy.splice(v.dislikedBy.indexOf(req.user.id),1);
    }
    else{
        v.dislikedBy.push(req.user.id);
        v.dislikesCount = v.dislikesCount + 1;
    }
    if(v.likedBy.includes(req.user.id)){
        v.likedBy.splice(v.likedBy.indexOf(req.user.id),1);
        v.likesCount = v.likesCount - 1;
        await likedVideo.findOneAndDelete({userid:req.user.id,Videoid:v._id},(err,res)=>{
            console.log(err,"\n err on line 187 of controllers/video")
        });
    }
    await v.save();
    res.status(200).json({success:true});
}

exports.addComment = async(req,res,next)=>{
   const video = await Video.findById(req.params.id);
   let rcomment;
   if(req.body.commentId)
     rcomment = await Comment.findById(req.body.commentId);
   if(!video)
     return next({
         statusCode:404,
         message:"Video not found"
     })
    if(!this.accessibility(req,video)){
        return next({
            statusCode:401,
            message:"Unauthorised access"
        })
    }
    const comment = req.body.Repliedto?await Comment.create({
        user: req.user.id,
        Video: req.params.id,
        text: req.body.text,
        Repliedto: req.body.Repliedto
    }) :
    await Comment.create({
        user: req.user.id,
        Video: req.params.id,
        text: req.body.text,        
    });
    if(req.body.Repliedto){
        await Notification.create({receiver:[req.body.Repliedto],url:`/stream/${video._id}`,VideoId:video._id,commentId:rcomment&&rcomment._id,sender:req.user.fullname,avatar:req.user.avatar,Message:`${req.user.fullname} replied to your comment in the video stream of title ${video.title}`,type:"replytocomment"});
    }
    video.comments.push(comment._id);
    await video.save();
    comment = await comment
    .populate({ path: "user", select: "avatar username fullname" })
    .execPopulate();

  res.status(200).json({ success: true, data: comment});
    
}
exports.deletecomment = async(req,res,next)=>{
    const video = await Video.findById(req.params.id);
   if(!video)
     return next({
         statusCode:404,
         message:"Video not found"
     })
    if(!this.accessibility(req,video)){
        return next({
            statusCode:401,
            message:"Unauthorised access"
        })
    }
    const comment = await Comment.findById(req.params.commentId);
    if(!comment||comment.user!=req.user.id||!req.user.isAdmin){// Admin and owner can delete comment
        return next({
            statusCode:400,
            message:"Action failed"
        })
    }
    await comment.remove();
    await Notification.deleteMany({commentId:comment._id},(err,res)=>{console.log("Generated on line 245 ,controllers/video\n"+err)});
    video.comments.splice(video.comments.indexOf(comment._id),1);
    await video.save();
    res.status(200).json({success:true});

}
exports.reportVideo = async(req,res,next)=>{
    const video = await Video.findById(req.params.id);
    if(!video||!this.checkAccessibility(req,video)||video.oraganiser==req.user.id){
        return next({
            statusCode:400,
            message:"Action failed"
        })
    }
    const report = await Report.findOne({ reporter: req.user.id, videoId: req.params.id });
    if (!video.reportCount) {
        video.reportCount = 0;
      }
      if (report) {
        video.reportCount = video.reportCount - 1;
        await report.remove();
        //delete previous report filed by this user and replace it with new report
      }
      video.reportCount = video.reportCount + 1;
        
      //mail admin for checking 
      //this stream so that appropriate action will be taken
      const msg ={
        to:process.env.ADMIN_EMAIL,
        from:process.env.EMAIL,
        subject:`Report against the video "${video.title}"`,
        text:"Hello admin,\nUsers of letstream are reporting the video stream Videoed by "+video.oraganiser.fullname+"\nKindly,take the suitable action against it.URL of the video is \n\n"+video.url+"\nTotal reports filled have reached "+video.reportCount+"\n\nHappy Streaming",
        
      }; 
      if(video.reportCount%10==0){
        transporter.sendMail(msg).then(()=>{
            res.status(200).json({success:true,message:"Kindly check your email for OTP"});
          }).catch((error)=>{
            res.status(200).json({success:false,message:error.message});
          })
      }
}

exports.searchVideo = async(req,res,next)=>{
    if (!req.query.title) {
        return ;
      }
    
      let Videos = [];
    
      if (req.query.title) {
        const regex = new RegExp(req.query.title, "i");
        Videos = await Video.find({ title: regex });
      }
      Videos = Videos.filter((Video) => { return this.checkAccessibility(req,Video)})
      res.status(200).json({ success: true, data: Videos});
}

exports.likecomment = async(req,res,next)=>{
    const c = await Comment.findById(req.params.cid);
    if(!c){
        return ;
    }
    
    const v = await Video.findById(c.Video);
    if(!v){
        return next({
            statusCode:404,
            message:"Action failed"
        })
    }
    if(!this.checkAccessibility(req,v)){
        return next({
            statusCode:401,
            message:"Unauthorised access"
        })
    }
    if(c.likedBy.indexOf(req.user.id)>-1){
        c.likesCount = c.likesCount - 1;
        c.likedBy.splice(c.likedBy.indexOf(req.user.id),1);
    }
    else{
        c.likedBy.push(req.user.id);
        c.likesCount = c.likesCount + 1;
    }
    if(c.dislikedBy.includes(req.user.id)){
        c.dislikedBy.splice(c.dislikedBy.indexOf(req.user.id),1);
        c.dislikesCount = c.dislikesCount - 1;
    }
    await c.save();    
    res.status(200).json({success:true});
}

exports.dislikecomment = async(req,res,next)=>{
    const c = await Comment.findById(req.params.cid);
    if(!c){
        return ;
    }
    
    const v = await Video.findById(c.Video);
    if(!v){
        return next({
            statusCode:404,
            message:"Action failed"
        })
    }
    if(!this.checkAccessibility(req,v)){
        return next({
            statusCode:401,
            message:"Unauthorised access"
        })
    }
    if(c.dislikedBy.indexOf(req.user.id)>-1){
        c.dislikesCount = c.dislikesCount - 1;
        c.dislikedBy.splice(c.dislikedBy.indexOf(req.user.id),1);
    }
    else{
        c.dislikedBy.push(req.user.id);
        c.dislikesCount = c.dislikesCount + 1;
    }
    if(c.likedBy.includes(req.user.id)){
        c.likedBy.splice(c.likedBy.indexOf(req.user.id),1);
        c.likesCount = c.likesCount - 1;
    }
    await c.save();
    res.status(200).json({success:true});
}
