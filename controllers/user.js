const User = require("../models/User");
const { checkAccessibility } = require("./video");
const transporter = require("../utils/nodemailer");
const {generateOTP} = require("./auth");
const savedVideo = require("../models/savedVideo");
const Video = require("../models/Video");
const likedVideo = require("../models/likedVideo");

exports.getUser = async(req,res,next)=>{
    const user = await User.findOne({username:req.params.username}).populate({
        path:"videos",
        select:"poster accessibility url title createdAt description visibility"
    });
    if(!user){
        return next({
            statusCode:400,
            message:"User not found"
        })
    }

    user.videos = user.videos.filter((v)=>checkAccessibility(req,v));
    if(req.params.username==req.user.username){
        user.likedvideos = await likedVideo.find({userid:req.user.id}).sort("-createdAt");
        user.savedVideos = await savedVideo.find({userid:req.user.id}).sort("-createdAt");
    }
    res.status(200).json({success:true,data:user.videos});

}

exports.searchUser = async(req,res,next)=>{
    if (!req.params.reg) {
        return next({ message: "The username cannot be empty", statusCode: 400 });
      }
    
      const regex = new RegExp(req.params.reg, "i");
    
      //let users = await User.find({ username: regex});
      User.find({ $or: [{ fullname: regex }, { username: regex }] }).select("username fullname video").then((data) => {
        res.status(200).json({ success: true, data });
      });
}

exports.editDetails = async (req, res, next) => {
    const { video, username, fullname, website, bio, email } = req.body;
  
    const fieldsToUpdate = {};
    if (video) fieldsToUpdate.video = video;
    if (username) fieldsToUpdate.username = username;
    if (fullname) fieldsToUpdate.fullname = fullname;
    if (email) fieldsToUpdate.email = email;
  
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { ...fieldsToUpdate, website, bio },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("video username fullname email bio website");
  
    res.status(200).json({ success: true, data: user});
  }

  exports.requestotp = async (req, res, next) => {
    if (req.user) {
      const expires = Date.now() + 7200000;
      const OTP = generateOTP(6);
      await OTPmodel.deleteMany({ email: req.user.email, type: "changepassword" });
  
      await OTPmodel.create({ type: "changepassword", email: req.user.email, expires, OTP });
      transporter.sendMail({
        to: req.user.email,
        from: process.env.EMAIL,
        subject: "OTP for changing password",
        text: "Hello " + req.user.fullname + ",\nhere is the OTP for changing your account password\n" + OTP + "\n\nThis OTP will expire in 2 hours\nThis is a system generated mail.So kindly do not reply.\n\nRegards\n Letstream team",
      }).then(() => {
        res.status(200).json({ success: true, messsage: "check your email for the OTP"});
      }).catch(err => {
        return next({
          statusCode: 400,
          message: err.message
        })
      })
    }
    else {
      return next({
        statusCode: 404,
        message: "Your user id could not be confirmed"
      })
    }
  }
  exports.changePassword = async (req, res, next) => {
    const { password, otp } = req.body;
    if (password.length < 6 || password.length > 20) {
      return next({
        message: "password should be 6-20 characters in length",
        statusCode: 400
      })
    }
    ////console.log(req.body);
    const otpif = await OTPmodel.findOne({ email: req.user.email, type: "changepassword", OTP: otp });
    ////console.log(req.user.email,otp);  
    if (otpif) {
      const user = await User.findOne({ email: req.user.email });
      const tempid = generateOTP(16);
      user.socketId = [];
      await user.updatePassword(password, tempid);
      await user.save();
      const token = await user.getJwtToken();
      otpif.remove();
      res.status(200).json({ success: true, token: token, message: "Password changed successfully"});
  
    }
    else {
      return next({
        statusCode: 404,
        message: "OTP did not match"
      })
    }
  
  }
  exports.sendNotice = async (req, res, next) => {
    
    if (req.user) {
      Notification.find({}).sort({ createdAt: -1 }).then((notices) => {       
        notices = notices.filter(function (notice) {
          return notice.receiver.includes(req.user.id) || notice.receiver.includes(req.user.username);
        })       
        res.status(200).json({ success: true,notices});
      })
    }
    else
      return next({ success: false, message: "Unable to verify user" });
  }

  exports.subscribe = async (req, res, next) => {
    // make sure the user exists
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next({
        message: `No user found for id ${req.params.id}`,
        statusCode: 404,
      });
    }
  
   
    if (req.params.id === req.user.id) {
      return next({ message: "Invalid request", status: 400 });
    }
  
   
    if (user.subscribers.includes(req.user.id)) {
        await User.findByIdAndUpdate(req.params.id, {
            $pull: { subscribers: req.user.id },     
          });
    }
    else{ 
        await User.findByIdAndUpdate(req.params.id, {
            $push: { subscribers: req.user.id },     
        });
        const noti = await Notification.create({
            sender: req.user.id,
            receiver: [req.params.id],
            video: req.user.video,
            type:"subscription",
            url: `/user/${req.user.username}`,
            Message: `${req.user.username} subscribed to your channel`
          })
    }
    const user2 = await User.findById(req.user.id);
    if (user2.subscribedto.includes(req.params.id)) {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedto: req.params.id },     
          });
    }
    else{ 
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedto: req.params.id },     
        });
    }    
  
    res.status(200).json({ success: true, data: {}});
  }
  exports.removeSubscriber = async (req, res, next) => {
    
    const user = await User.findById(req.user.id);
  
    // make sure the user is not the logged in user
    if (req.params.id === req.user.id) {
      return next({ message: "Invalid request", status: 400 });
    }
  
   
    if (user.subscribers.includes(req.params.id)) {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribers: req.params.id },     
          });
    }
    else{ 
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribers: req.params.id },     
        });
        await Notification.findOneAndDelete({
            sender: req.params.id,
            receiver:[req.user.id],          
            type:"subscription"
          },function(err,res){
              if(err)
                console.log(err,"\ndetected on line 202 controllers/user")
          })
    }
    const user2 = await User.findById(req.user.id);
    if (user2.subscribedto.includes(req.params.id)) {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedto: req.params.id },     
          });
    }
    else{ 
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedto: req.params.id },     
        });
    }    
  
    res.status(200).json({ success: true, data: {}});
  }
  exports.savevideo = async(req,res,next)=>{
    const isVideoavailable = await Video.findById(req.params.vid);
    if(!isVideoavailable||!checkAccessibility(req,isVideoavailable)){
        return next({
            statusCode:400,
            message:"Action failed"
        })
    }
    const issaved = await savedVideo.findOne({Videoid:req.params.vid,userid:req.user.id});
    if(issaved){
        await issaved.remove();
    }
    else{
        await savedVideo.create({Videoid:req.params.vid,userid:req.user.id});
    }
    res.status(200).json({success:true});

  }
  exports.feed = async(req,res,next)=>{
    let videos = await Video.find({}).populate({
        path:"organiser",
        select:"video username"
    }).populate({ path: "comments",  select: "text Repliedto",
    populate: { path: "user", select: "video fullname username" }})
    .sort("-createdAt")
    .lean()
    .exec();;
    videos = videos.filter(function(v){
        return checkAccessibility(res,v);
    });
    videos.forEach(function(v){
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
    })
    res.status(200).json({success:true,data:videos});
    
  }

/*
 const uploadFile = (file) => {

    // add file to FormData object
    const fd = new FormData();
    fd.append('video', file);

    // send `POST` request
    fetch('/uploadvideo', {
        method: 'POST',
        body: fd
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(err));
}

*/

exports.uploadVideo = async(req,res,next)=>{

    if(!req.user){
        return;
    }      
    try {
        if(!req.files) {
            return;
        } 
        else {
            //Use the name of the input field (i.e. "video") to retrieve the uploaded file
            let video = req.files.video;
            const name = generateOTP()+"_"+video.name;
            const video2 = await Video.create({
                description:req.body.description,
                title:req.body.title,
                servername:name,
                presenters:req.body.presenters,
                tags:req.body.tags,
                visibility:req.body.visibility,
                oraganiser:req.body.organiser
            });
            video2.url = `/stream/${video2._id.toString()}`;
            await video2.save();
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            video.mv('../uploads/' +name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: video.name,
                    mimetype: video.mimetype,
                    size: video.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    } 


}