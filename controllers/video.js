const User = require("../models/User");
const Video = require("../models/Video");
const Report = require("../models/Report");
const Notification = require("../models/Notification");
const fs = require("fs");
const path = require("path");
const {SOCKET,IO} = require("../utils/socketconnection");
const Comment = require("../models/Comment");
const transporter = require("../utils/nodemailer");
const likedVideo = require("../models/likedVideo");
const savedVideo = require("../models/savedVideo");

//const socket = SOCKET();
const io = IO();

exports.checkAccessibility = (req,video) =>{
    //console.log("video check",video);
    const organiser = video.organiser;
    ////console.log("organiser",organiser);
    //video.presenters.toString().indexOf(req.user.id.toString())>-1||
    return video.visibility=="public"||video.organiser._id.toString()==req.user.id.toString()||
    (video.visibility=="sub-only"&&organiser.subscribers.toString().indexOf(req.user.id.toString())>-1)
    ||(video.visibility=="custom"&&video.accessibility.indexOf(req.user.id.toString())>-1)
}



exports.getvideo = async(req,res,next) =>{
    const vid = await Video.findById(req.params.id)
    .populate({
        path:"organiser",
        select:"username avatar subscribers"
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
            message:"You are not allowed to view this video"
        })
    }
    const range = req.headers.range; 
    
    const videoPath = path.join(__dirname,`../uploads/${vid.servername}`);
    const videoSize = fs.statSync(videoPath).size;
  
    
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    // Create headers
    const contentLength = end - start + 1;
    
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": vid.mimetype,
    };
  
    // HTTP Status 206 for Partial Content
    
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    
    if (!range) {
        delete headers["Content-Range"];
        delete headers["Accept-Ranges"];
        videoStream.pipe(res);
    }
    else{
        res.writeHead(206, headers);
        videoStream.pipe(res);
    }
    

}
exports.sendvideoinfo = async(req,res,next)=>{
    const v = await Video.findById(req.params.id).populate({
        path:"organiser",
        select:"username avatar subscribers"
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
            message:"Either link is broken or you are not allowed to view it"
        })
    }
    
    v.isMyVideo = v.organiser._id.toString()==req.user.id;
    v.isLiked = v.likedBy.toString().includes(req.user.id);
    v.isdisLiked = v.dislikedBy.toString().includes(req.user.id);
    v.organiser.subscribersCount = v.organiser.subscribers.length;
    v.organiser.isSubscribed = req.user.subscribedto.toString().includes(v.organiser._id.toString());

    const user = await User.findById(req.user.id);
    const isSaved = await savedVideo.findOne({userid:user._id,Videoid:v._id});
    if(isSaved){
        v.isSaved = true
    }
    else{
        v.isSaved = false;
    }
    v.comments.forEach(function(c){
        c.isMine = req.user.id==c.user._id.toString();
    })
    console.log("video",v);   
    res.status(200).json({success:true,video:v});

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

exports.Highlight = async(req,res,next) =>{
   const highlightedvideos =  await Video.find({}).populate({
       path:"organiser",
       select:"username subscribers"
   }).sort({likesCount:-1}).sort({dislikesCount:1});

   const checkAccessibility = function(req,video){
    ////console.log("check video",video);
    const organiser = video.organiser;
    //console.log(organiser);
    return video.visibility=="public"||video.organiser._id.toString()==req.user.id.toString()||video.presenters.indexOf(req.user.id)>-1||
    (video.visibility=="sub-only"&&organiser.subscribers.toString().indexOf(req.user.id.toString())>-1)
    ||(video.visibility=="custom"&&video.accessibility.indexOf(req.user.id.toString())>-1)
}
   //select accessible videos
   let accessibleones = highlightedvideos.filter(function(v){
    return checkAccessibility(req,v);
   });
   accessibleones.forEach(function(v){v.isLiked = v.likedBy.toString().includes(req.user.id),v.isdisLiked = v.dislikedBy.toString().includes(req.user.id),v.likedBy=[],v.dislikedBy = [],v.organiser.subscribers=[]})
     
   res.status(200).json({success:true,videos:accessibleones});

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
            //console.log(err,"\n err on line 145 of controllers/video")
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

exports.toggledislike = async(req,res,next) =>{
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
            //console.log(err,"\n err on line 187 of controllers/video")
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
    io.to(req.params.id).emit("newmsg",comment);
  res.status(200).json({ success: true, data: comment});
    
}
exports.deleteComment = async(req,res,next)=>{
    const video = await Video.findById(req.params.id);
   if(!video)
     return next({
         statusCode:404,
         message:"Video not found"
     })
    if(!this.checkAccessibility(req,video)){
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
    await Notification.deleteMany({commentId:comment._id},(err,res)=>{
        //console.log("Generated on line 245 ,controllers/video\n"+err)
    });
    video.comments.splice(video.comments.indexOf(comment._id),1);
    await video.save();
    res.status(200).json({success:true});

}
exports.reportVideo = async(req,res,next)=>{
    const video = await Video.findById(req.params.id);
    if(!video||!this.checkAccessibility(req,video)||video.organiser==req.user.id){
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
        text:"Hello admin,\nUsers of letstream are reporting the video stream Videoed by "+video.organiser.fullname+"\nKindly,take the suitable action against it.URL of the video is \n\n"+video.url+"\nTotal reports filled have reached "+video.reportCount+"\n\nHappy Streaming",
        
      }; 
      const admin = await User.find({isAdmin:true});
      const adminid = [];
      for(x of admin){
          adminid.push(x._id);
      }
      if(admin){
          await Notification.create({
              Message:"Hello admin,\nUsers of letstream are reporting the video stream Videoed by "+video.organiser.fullname+"\nKindly,take the suitable action against it.\nTotal reports filled have reached "+video.reportCount,
              sender:"system",
              receiver:adminid,
              url:video.url,
              VideoId:video._id
          })
      }
      if(video.reportCount%10==0){
        transporter.sendMail(msg).then(()=>{
            res.status(200).json({success:true,message:"Kindly check your email for OTP"});
          }).catch((error)=>{
            res.status(200).json({success:false,message:error.message});
          })
      }
}

exports.searchVideo = async(req,res,next)=>{
    if (!req.body.term) {
        return ;
      }
    
      let Videos = [];
    
      if (req.body.term) {
        const regex = new RegExp(req.body.term, "i");
        Videos = await Video.find({$or: [{ title: regex },{keywords:{$in:[regex]}},{description:regex}]}).populate({path:"organiser",select:"username subscribers"}).sort("-createdAt");
        
      }
    //   //console.log(Videos);
      Videos = Videos.filter((V,pos)=>{ return this.checkAccessibility(req,V)});
      Videos.forEach(v=>{v.isLiked = v.likedBy.toString().includes(req.user.id),v.isdisLiked = v.dislikedBy.toString().includes(req.user.id),v.likedBy=[],v.dislikedBy = [],v.organiser.subscribers = []})
      res.status(200).json({ success: true, videos:Videos});
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
