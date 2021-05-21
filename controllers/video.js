const User = require("../models/User");
const Video = require("../models/Video");
const Report = require("../models/Report");
const Notification = require("../models/Notification");
const fs = require("fs");
const path = require("path");
const { SOCKET, IO } = require("../utils/socketconnection");
const Comment = require("../models/Comment");
const transporter = require("../utils/nodemailer");
const likedVideo = require("../models/likedVideo");
const savedVideo = require("../models/savedVideo");

//const socket = SOCKET();
const io = IO();

exports.checkAccessibility = (req, video) => {
    console.log("video check",video);
    if(!video||!video.organiser){
        return false;
    }
    const organiser = video.organiser;
    //console.log("organiser",organiser);
    //video.presenters.toString().indexOf(req.user.id.toString())>-1||
    return req.user.isAdmin||video.visibility == "public" || video.organiser._id.toString() == req.user.id.toString() ||
        (video.visibility == "sub-only" && organiser && organiser.subscribers.toString().indexOf(req.user.id.toString()) > -1)
        || (video.visibility == "custom" && video.accessibility&&video.accessibility.indexOf(req.user.id.toString()) > -1)
}



exports.getvideo = async (req, res, next) => {
    const vid = await Video.findById(req.params.id)
        .populate({
            path: "organiser",
            select: "username avatar subscribers"
        })
        .lean()
        .exec();

    if (!vid) {
        return next({
            statusCode: 404,
            message: "This video is not found"
        })
    }


    if (!this.checkAccessibility(req, vid)) {
        return next({
            statusCode: 401,
            message: "You are not allowed to view this video"
        })
    }
    const range = req.headers.range;

    const videoPath = path.join(__dirname, `../uploads/${vid.servername}`);
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
    else {
        res.writeHead(206, headers);
        videoStream.pipe(res);
    }


}
exports.sendvideoinfo = async (req, res, next) => {
    let v;
    try {
        v = await Video.findById(req.params.id).populate({
            path: "organiser",
            select: "username avatar subscribers"
        }).populate({
            path: "comments",
            select: "text createdAt likedBy dislikedBy",
            populate: {
                path: "user",
                select: "username avatar",
            },
        }).lean()
            .exec();
    }
    catch (err) {
        return next({
            statusCode: 404,
            message: "Video not found"
        })
    }
    if (!v || !this.checkAccessibility(req, v)) {
        return next({
            statusCode: 400,
            message: "Either link is broken or you are not allowed to view it"
        })
    }

    v.isMyVideo = v.organiser._id.toString() == req.user.id;
    v.isAdmin = req.user.isAdmin;
    v.isLiked = v.likedBy.toString().includes(req.user.id);
    v.isdisLiked = v.dislikedBy.toString().includes(req.user.id);
    v.organiser.subscribersCount = v.organiser.subscribers.length;
    v.reportCount = 0;
    v.organiser.isSubscribed = req.user.subscribedto.toString().includes(v.organiser._id.toString());

    const user = await User.findById(req.user.id);
    const isSaved = await savedVideo.findOne({ userid: user._id, Videoid: v._id });
    if (isSaved) {
        v.isSaved = true
    }
    else {
        v.isSaved = false;
    }
    v.comments.forEach(function (c) {
        c.isMine = req.user.id == c.user._id.toString();
        c.likesCount = c.likedBy.length;
        c.dislikesCount = c.dislikedBy.length;
        c.isLiked = c.likedBy.toString().includes(req.user.id);
        c.isdisLiked = c.dislikedBy.toString().includes(req.user.id);
        c.likedBy = [];
        c.dislikedBy = [];
    });
    v.dislikesCount = v.dislikedBy.length;
    v.likesCount = v.likedBy.length;
    v.views = v.viewedby.length;
    v.viewedby = [];
    //console.log("video", v);
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, video: v });

}
exports.deletevideo = async (req, res, next) => {
    const video = await Video.findById(req.params.id);
    if (video.organiser == req.user.id) {
        await video.remove();
        res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, message: "Video deleted successfully" });
        
    }
    else {
        return next({
            statusCode: 401,
            message: "Action failed"
        })
    }
}
exports.editVideo = async(req,res,next)=>{
    const video = await Video.findById(req.params.vid);
    if(!video||video.organiser.toString()!=req.user.id){
        return next({
            statusCode:403,
            message:"Failed to update details"
        })
    }
    const {title,description,keywords,visibility,accessibility} = req.body;
    const fieldstoUpdate = {};
    if(title) fieldstoUpdate.title = title;
    if(description) fieldstoUpdate.description = description;
    if(keywords) fieldstoUpdate.keywords = keywords;
    if(visibility) fieldstoUpdate.visibility = visibility;
    if(accessibility) fieldstoUpdate.accessibility = accessibility;
    //console.log("editdata",req.body);
    if(visibility=="custom"&&(!accessibility||accessibility.length==0)){
        return next({
            statusCode:400,
            message:"You must add atleast one user who can view your private video"
        })
    }
    await Video.findByIdAndUpdate(req.params.vid,{
        $set:{...fieldstoUpdate}
    },
    {
        new: true,
        runValidators: true,
    });
    res.status(200).json({success:true});
}

exports.Highlight = async (req, res, next) => {
    let highlightedvideos = await Video.find({}).populate({
        path: "organiser",
        select: "username subscribers"
    });
    highlightedvideos = highlightedvideos.sort(function(a,b){
        return b.likedBy.length - a.likedBy.length - b.dislikedBy.length + a.dislikedBy.length;
    })
    const checkAccessibility = function (req, video) {
        //////console.log("check video",video);
        if(!video||!video.organiser){
            return false;
        }
        const organiser = video.organiser;
        ////console.log(organiser);
        return video.visibility == "public" || video.organiser._id.toString() == req.user.id.toString() || video.presenters.indexOf(req.user.id) > -1 ||
            (video.visibility == "sub-only" && organiser.subscribers.toString().indexOf(req.user.id.toString()) > -1)
            || (video.visibility == "custom" && video.accessibility.indexOf(req.user.id.toString()) > -1)
    }
    //select accessible videos
    let accessibleones = highlightedvideos.filter(function (v) {
        return checkAccessibility(req, v);
    });
    accessibleones.forEach(function (v) {v.dislikesCount = v.dislikedBy.length,
        v.likesCount = v.likedBy.length,
        v.views = v.viewedby.length, v.isLiked = v.likedBy.toString().includes(req.user.id), v.isdisLiked = v.dislikedBy.toString().includes(req.user.id), v.likedBy = [], v.dislikedBy = [], v.organiser.subscribers = [] })

    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, videos: accessibleones });

}

exports.toggleLike = async (req, res, next) => {
    const v = await Video.findById(req.params.id).populate({
        path: "organiser",
        select: "subscribers"
    });
    const user = await User.findById(req.user.id);
    if (!v || !user) {
        return next({
            statusCode: 404,
            message: "Action failed"
        })
    }
    if (!this.checkAccessibility(req, v)) {
        return next({
            statusCode: 401,
            message: "Unauthorised access"
        })
    }
    await Notification.deleteMany({type:"likevideo",VideoId:v._id},(err,res)=>{
        if(err) console.log(err)
    })
    let isLiked = false;
    const idex = v.likedBy.indexOf(req.user.id);
    if (idex > -1) {
        v.likesCount = v.likesCount - 1;        
        v.likedBy.splice(idex, 1);
        await likedVideo.findOneAndDelete({ userid: req.user.id, Videoid: v._id }, (err, res) => {
            if (err) {
                return next({
                    statusCode: 500,
                    message: "Action failed"
                })
            }
        });
    }
    else {
        v.likedBy.push(req.user.id);
        const noti = await Notification.create({
            receiver:[v.organiser._id],
            sender:req.user.username,
            VideoId:v._id,
            Message:"Someone liked your video "+v.title,
            type:"likevideo",
            url:`/video/${v._id}`,
        })
        await User.findByIdAndUpdate(v.organiser._id,{
            $push:{unseennotice:noti._id}
        })
        await user.save();
        isLiked = true;
        v.likesCount = v.likesCount + 1;
        await likedVideo.create({ userid: req.user.id, Videoid: v._id })
    }
    const idex2 = v.dislikedBy.indexOf(req.user.id);
    if (idex2>-1) {
        v.dislikedBy.splice(idex2, 1);
        v.dislikesCount = v.dislikesCount - 1;
    }
    await v.save();
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, isLiked: isLiked, isdisLiked: false });
}

exports.toggledislike = async (req, res, next) => {
    const v = await Video.findById(req.params.id).populate({
        path:"organiser",
        select:"subscribers"
    });
    if (!v) {
        return next({
            statusCode: 404,
            message: "Action failed"
        })
    }
    await Notification.deleteMany({type:"likevideo",VideoId:v._id,sender:req.user.username},(err,res)=>{
        if(err) console.log(err)
    })
    if (!this.checkAccessibility(req, v)) {
        return next({
            statusCode: 401,
            message: "Unauthorised access"
        })
    }
    let isdisLiked = false;
    const idex = v.dislikedBy.indexOf(req.user.id);
    if (idex > -1) {
        v.dislikesCount = v.dislikesCount - 1;
        v.dislikedBy.splice(idex, 1);
    }
    else {
        isdisLiked = true;
        v.dislikedBy.push(req.user.id);
        v.dislikesCount = v.dislikesCount + 1;
    }
    const idex2 = v.likedBy.indexOf(req.user.id);
    if (idex2>-1) {
        v.likedBy.splice(idex2, 1);
        v.likesCount = v.likesCount - 1;
        await likedVideo.findOneAndDelete({ userid: req.user.id, Videoid: v._id }, (err, res) => {
            ////console.log(err,"\n err on line 187 of controllers/video")
        });
    }
    await v.save();
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, isLiked: false, isdisLiked: isdisLiked });
}

exports.addComment = async (req, res, next) => {
    const video = await Video.findById(req.params.id).populate({
        path: "organiser",
        select: "subscribers"
    });
    let rcomment;
    if (req.body.commentId)
        rcomment = await Comment.findById(req.body.commentId).lean().exec();
    if (!video)
        return next({
            statusCode: 404,
            message: "Video not found"
        })
    if (!this.checkAccessibility(req, video)) {
        return next({
            statusCode: 401,
            message: "Unauthorised access"
        })
    }
    let comment = req.body.Repliedto ? await Comment.create({
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
    if (req.body.Repliedto) {
        await Notification.create({ receiver: [req.body.Repliedto], url: `/video/${video._id}/?commentId=${comment._id}`, VideoId: video._id, commentId: rcomment && rcomment._id, sender: req.user.username, avatar: req.user.avatar, Message: `${req.user.fullname} replied to your comment in the video ${video.title} by ${video.organiser.username}`, type: "replytocomment" });
    }
    if(req.user.id!=video.organiser._id.toString()){
    const noti = await Notification.create({
        receiver:[video.organiser._id],
        sender:req.user.username,
        commentId:comment._id,
        Message:"Someone commented on your video "+video.title,
        type:"commentvideo",
        url:`/video/${video._id}`,
    })
    await User.findByIdAndUpdate(video.organiser._id,{
        $push:{unseennotice:noti._id}
    })
}
    video.comments.push(comment._id);
    await video.save();
    comment = await comment
        .populate({ path: "user", select: "avatar username" })
        .execPopulate();
    comment.likesCount = 0;
    comment.dislikesCount = 0;
    comment.isLiked = false;
    comment.isdisLiked = false;
    comment.isMine = true;
    //io.to(req.params.id).emit("newmsg",comment);
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, comment: comment });

}
exports.deleteComment = async (req, res, next) => {
    const video = await Video.findById(req.params.id).populate({
        path: "organiser",
        select: "subscribers"
    });
    if (!video)
        return next({
            statusCode: 404,
            message: "Video not found"
        })
    if (!this.checkAccessibility(req, video)) {
        return next({
            statusCode: 401,
            message: "Unauthorised access"
        })
    }
    const comment = await Comment.findById(req.params.commentId);
    //console.log(comment)
    if ((!comment || comment.user.toString() != req.user.id)&&!req.user.isAdmin) {// Admin and owner can delete comment
        return next({
            statusCode: 400,
            message: "Action failed"
        })
    }
    
    await Notification.deleteMany({ commentId: comment._id }, (err, res) => {
        ////console.log("Generated on line 245 ,controllers/video\n"+err)
    });
    video.comments.splice(video.comments.indexOf(comment._id), 1);
    await video.save();
    await comment.remove();
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true });

}
exports.reportVideo = async (req, res, next) => {
    const video = await Video.findById(req.params.id).populate({
        path:"organiser",
        select:"subscribers fullname"
    });
    if (!video || !this.checkAccessibility(req, video) || video.organiser._id.toString() == req.user.id) {
        return next({
            statusCode: 400,
            message: "Action failed"
        })
    }
    if(req.body.report.length>300){
        return next({
            statusCode: 403,
            message: "Report length should not exeeed 300 letters"
        })
    }
    const report = await Report.findOne({ reporter: req.user.id, VideoId: req.params.id });
    if (!video.reportCount) {
        video.reportCount = 0;
    }
    if (report) {
        video.reportCount = video.reportCount - 1;
        await report.remove();
        //delete previous report filed by this user and replace it with new report
    }
    await Report.create({
        reporter:req.user.id,
        VideoId:req.params.id,
        description:req.body.report
    })
    video.reportCount = video.reportCount + 1;

    //mail admin for checking 
    //this video so that appropriate action will be taken
    const msg = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.EMAIL,
        subject: `Report against the video "${video.title}"`,
        text: "Hello admin,\nUsers of letstream are reporting the video uploaded by " + video.organiser.fullname + "\n.Kindly,take the suitable action against it.URL of the video is \n\n" + process.env.SERVER_ADDRESS+"/video/"+video._id + "\nTotal reports filled have reached " + video.reportCount + "\n\nHappy Streaming",

    };
    const admin = await User.find({ isAdmin: true });
    const adminid = [];
    for (x of admin) {
        adminid.push(x._id);
    }
    await Notification.deleteMany({sender:"system"},(err,res)=>{})
    if (admin) {
        await Notification.create({
            Message: "Hello admin,\nUsers of letstream are reporting the video by " + video.organiser.fullname + "\nKindly,take the suitable action against it.\nTotal reports filled have reached " + video.reportCount,
            sender: "system",
            receiver: adminid,
            url: "/video/"+video._id,
            VideoId: video._id
        })
    }
    await video.save();
    if (video.reportCount % 10 == 0) {
        transporter.sendMail(msg).then(() => {
            res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, message: "Report submitted successfully" });
        }).catch((error) => {
            res.status(500).json({ success: false, message: "Mail was not sent to admin" });
        })
    }
    else{
        res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, message: "Report submitted successfully" });
    }
    
}

exports.searchVideo = async (req, res, next) => {
    if (!req.body.term) {
        return;
    }

    let Videos = [];

    if (req.body.term) {
        const regex = new RegExp(req.body.term, "i");
        Videos = await Video.find({ $or: [{ title: regex }, { keywords: { $in: [regex] } }, { description: regex }] }).populate({ path: "organiser", select: "username subscribers" }).sort("-createdAt");

    }
    //   ////console.log(Videos);
    Videos = Videos.filter((V, pos) => { return this.checkAccessibility(req, V) });
    Videos.forEach(v => { v.isLiked = v.likedBy.toString().includes(req.user.id), v.isdisLiked = v.dislikedBy.toString().includes(req.user.id),v.dislikesCount = v.dislikedBy.length,
        v.likesCount = v.likedBy.length,
        v.views = v.viewedby.length,v.viewedby=[], v.likedBy = [], v.dislikedBy = [], v.organiser.subscribers = [] })
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, videos: Videos });
}

exports.likecomment = async (req, res, next) => {
    const c = await Comment.findById(req.params.cid);
    if (!c) {
        return next({
            statusCode: 400,
            message: "Invalid request"
        });
    }
    console.log(c);
    const v = await Video.findById(c.Video).populate({
        path:"organiser",
        select:"subscribers"
    });
    if (!v) {
        return next({
            statusCode: 404,
            message: "Action failed"
        })
    }
    if (!this.checkAccessibility(req, v)) {
        return next({
            statusCode: 401,
            message: "Unauthorised access"
        })
    }
    let isliked = false;
    let commentowner = await User.findById(c.user);
    const idex = c.likedBy.indexOf(req.user.id);
    console.log(idex);
    if (idex > -1) {
        c.likesCount = c.likesCount - 1;
        c.likedBy.splice(idex, 1);
        const noti = await Notification.findOne({type:"likecomment",commentId:c._id,sender:req.user.username});
        if(noti){
            const index = commentowner.unseennotice.indexOf(noti._id)
            if(index > -1){
                commentowner.unseennotice.splice(index,1);                
            }
            await commentowner.save();
            await noti.remove();
        }
    }
    else {
        c.likedBy.push(req.user.id);
        await Notification.deleteMany({commentId:c._id,type:"likecomment"},(err,res)=>{
            //console.log(err);
        })
        if(c.user!=req.user.id){
        const noti2 = await Notification.create({
            sender:req.user.username,
            receiver:[c.user],
            type:"likecomment",
            VideoId:v._id,
            commentId:c._id,
            Message:"Someone liked your comment",
            url:'/video/'+v._id+"/?commentId="+c._id
        })
        commentowner.unseennotice.push(noti2._id);
    }
        await commentowner.save();
        c.likesCount = c.likesCount + 1;
        isliked = true;
    }
    const idex2 = c.dislikedBy.indexOf(req.user.id);
    if (idex2>-1) {
        c.dislikedBy.splice(idex2, 1);
        c.dislikesCount = c.dislikesCount - 1;

    }
    c.dislikesCount = c.dislikedBy.length;
    c.likesCount = c.likedBy.length;
    await c.save();
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, isdisLiked: false, isLiked: isliked });
}

exports.dislikecomment = async (req, res, next) => {
    const c = await Comment.findById(req.params.cid);
    if (!c) {
        return next({
            statusCode: 400,
            message: "Invalid request"
        });
    }

    const v = await Video.findById(c.Video).populate({
        path:"organiser",
        select:"subscribers"
    });
    if (!v) {
        return next({
            statusCode: 404,
            message: "Action failed"
        })
    }
    if (!this.checkAccessibility(req, v)) {
        return next({
            statusCode: 401,
            message: "Unauthorised access"
        })
    }
    let disliked = false;
    const noti = await Notification.findOne({type:"likecomment",commentId:c._id,sender:req.user.username});
    const commentowner = await User.findById(c.user);
    if(noti){
        const index = commentowner.unseennotice.indexOf(noti._id)
        if(index > -1){
            commentowner.unseennotice.splice(index,1);            
        }
        await commentowner.save();
        await noti.remove();
}
    const idex = c.dislikedBy.indexOf(req.user.id);
    if (idex > -1) {
        
        c.dislikedBy.splice(idex, 1);
        c.dislikesCount = c.dislikedBy.length;
    }
    else {
        c.dislikedBy.push(req.user.id);
        c.dislikesCount = c.dislikedBy.length;
        disliked = true;
    }
    const idex2 = c.likedBy.indexOf(req.user.id);
    if (idex2>-1) {
        c.likedBy.splice(idex2, 1);       
        c.likesCount = c.likedBy.length;
    }
    c.dislikesCount = c.dislikedBy.length;
    c.likesCount = c.likedBy.length;
    await c.save();
    res.status(200).json({ unseennotice:req.user.unseennotice.length,success: true, isLiked: false, isdisLiked: disliked });
}

exports.addoneView = async(req,res,next)=>{
    const v = await Video.findOne({_id:req.params.url}).populate({
        path:"organiser",
        select:"subscribers"
    });
    if(!v||!this.checkAccessibility(req,v)){
        return;
    }
    if(v.viewedby.toString().includes(req.user.id)){
        return;
    }
    //console.log("viewed",v);
    await Video.findByIdAndUpdate(req.params.url,{
        $inc:{views:1}, 
        $push:{viewedby:req.user.id},        
    })
    
    res.status(200).json({success:true});
}