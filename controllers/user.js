const User = require("../models/User");
const { checkAccessibility } = require("./video");
const transporter = require("../utils/nodemailer");
const { generateOTP } = require("./auth");
const savedVideo = require("../models/savedVideo");
const Video = require("../models/Video");
const likedVideo = require("../models/likedVideo");
const Notification = require("../models/Notification");

exports.getHistory = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "history",
    select: "accessibility url title createdAt description visibility views likedBy dislikedBy likesCount dislikesCount",
    populate: {
      path: "organiser",
      select: "username subscribers",
    },
  });
  if (!user) {
    return next({
      statusCode: "400",
      message: "Error in fetching history",
      logout: true
    })
  }
  user.history = user.history.filter((v) => checkAccessibility(req, v)).reverse();
  user.history.forEach(function(v){ v.isLiked = v.likedBy.toString().indexOf(req.user.id)>-1,v.isdisLiked = v.dislikedBy.toString().indexOf(req.user.id)>-1,v.likedBy=[],v.dislikedBy = [],v.organiser.subscribers = []});
  //user.history = user.history.map(v => v.organiser.subscribers = []);
  res.status(200).json({ success: true, videos: user.history });

}

exports.getSuggestions = async (req, res, next) => {
  let data = [];
//   const users =  await User.find({});
//  for(x of users){
//    x.subscribedto = [];
//    x.subscribers = [];
//    await x.save();
//  }
  ////console.log(req.user);
  await User.find({}).then((users) => {
    ////console.log(u);
    users.forEach(function (u) {
      let isSubscribed = false;
      isSubscribed = req.user.subscribedto.toString().includes(u._id.toString());
      if (!(u._id.toString().indexOf(req.user.id)>-1))
        data.push({ avatar: u.avatar, fullname: u.fullname, username: u.username, _id: u._id, isSubscribed });
    })
  }).catch(err => {
    //console.log(err);
    return next({
      statusCode: 500,
      message: "Internal server error"
    })
  })

  res.status(200).json({ success: true, users: data });

}

exports.getMyVideos = async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "videos",
    select: "url title createdAt description visibility views likedBy dislikedBy likesCount dislikesCount",
    populate: {
      path: "organiser",
      select: "username",
    },
  });
  if (!user) {
    return next({
      statusCode: "400",
      message: "Error in fetching your videos",
      logout: true
    })
  }
  user.videos = user.videos.reverse();
  user.videos.forEach(function(v){v.isLiked = v.likedBy.toString().indexOf(req.user.id)>-1,v.isdisLiked = v.dislikedBy.toString().indexOf(req.user.id)>-1,v.likedBy=[],v.dislikedBy = []});
  res.status(200).json({ success: true, videos: user.videos });

}

exports.getsavedVideos = async (req, res, next) => {
  const userv = await User.findById(req.user._id);
  const savedVideos = await savedVideo.find({ userid: userv._id }).populate({
    path: "Videoid",
    select: "url title description createdAt visibility views accessibility likedBy dislikedBy likesCount dislikesCount",
    populate: {
      path: "organiser",
      select: "username subscribers"
    }
  }).sort("-createdAt");
  let data = savedVideos.filter(v => checkAccessibility(req, v.VideoId));
  const receiveddata = [];
  data.forEach(function (v) {
    v.VideoId.isLiked = (v.VideoId.likedBy.toString().indexOf(req.user.id) > -1);
    v.VideoId.isdisLiked = (v.VideoId.dislikedBy.toString().indexOf(req.user.id) > -1);
    v.VideoId.likedBy=[];
    v.VideoId.dislikedBy = [];
    v.VideoId.organiser.subscribers = []
    receiveddata.push(v.VideoId);
  })

  res.status(200).json({ success: true, videos: receiveddata });

}


exports.getlikedVideos = async (req, res, next) => {
  const userv = await User.findById(req.user._id);
  const likedVideos = await likedVideo.find({ userid: userv._id }).populate({
    path: "Videoid",
    select: "url title description createdAt visibility views accessibility likedBy dislikedBy likesCount dislikesCount",
    populate: {
      path: "organiser",
      select: "username subscribers"
    }
  }).sort("-createdAt");
  let data = likedVideos.filter(v => checkAccessibility(req, v.VideoId));
  const receiveddata = [];
  data.forEach(function (v) {
    v.VideoId.isLiked = v.VideoId.likedBy.toString().indexOf(req.user.id)>-1;
    v.VideoId.isdisLiked = v.VideoId.dislikedBy.toString().indexOf(req.user.id)>-1;
    v.VideoId.likedBy=[];
    v.VideoId.dislikedBy = [];
    v.VideoId.organiser.subscribers = [];
    receiveddata.push(v.VideoId);
  })

  res.status(200).json({ success: true, videos: receiveddata });

}

exports.getLiveVideos = async (req, res, next) => {
  return next({
    statusCode: 400,
    message: "Not available"
  })
}

exports.getUser = async (req, res, next) => {
  let user;
  try{
   user = await User.findById(req.body.id).select("videos avatar cover subscribers fullname username isAdmin bio website").populate({
    path: "videos",
    select: "accessibility url title description visibility",
    populate: {
      path: "organiser",
      select: "subscribers"
    }
  }).populate({
    path:"subscribers",
    select:"username fullname avatar subscribers"    
  }).lean()
  .exec();
}
catch(err){
  return next({
    statusCode: 404,
    message: "User not found"
  })
}
  if (!user) {
    return next({
      statusCode: 404,
      message: "User not found"
    })
  }
  user.isSubscribed = false;
  if(req.user.subscribedto.toString().indexOf(user._id.toString())>-1)
    user.isSubscribed = true;
  const length = user.subscribers.length;
  user.subscribersCount =  length;
  user.subscribers.forEach(s=>{
    s.isSubscribed = false;
    if(req.user.subscribedto.toString().indexOf(s._id.toString())>-1)
      s.isSubscribed = true;
    s.subscribersCount = s.subscribers.length;
    s.isMe = s._id.toString()===req.user.id;
    //s.subscribers = [];
  })
  user.isMe = false;
  if(user._id.toString()===req.user.id)
     user.isMe = true;
  user.videos = user.videos.filter((v) => checkAccessibility(req, v));
  //console.log("user")
  console.log("request user",user.subscribers);
  res.status(200).json({ success: true, user: user});

}
exports.addtoViewedVideo = async (req, res, next) => {
  const vid = await Video.findById(req.params.vid);
  if (!vid || !checkAccessibility(req, vid)) {
    return next({
      statusCode: 400,
      message: "Action failed"
    })
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { history: req.params.vid }
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { history: req.params.vid }
    });
  }
  catch (err) {
    return next({
      statusCode: 400,
      message: "Action failed"
    })
  }
  res.status(200).json({ success: true });
}
exports.removeFromHistory = async (req, res, next) => {
  const vid = await Video.findById(req.params.vid);
  if (!vid) {
    return next({
      statusCode: 400,
      message: "Action failed"
    })
  }

  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { history: req.params.vid }
    });
  }
  catch (err) {
    return next({
      statusCode: 400,
      message: "Action failed"
    })
  }
  res.status(200).json({ success: true });

}

exports.searchUser = async (req, res, next) => {
  if (!req.body.term) {
    return ;
  }
  //console.log(req.user);
  const regex = new RegExp(req.body.term, "i");

  //let users = await User.find({ username: regex});
  User.find({ $or: [{ fullname: regex }, { username: regex }] }).select("username fullname avatar").then((data) => {
    data = data.filter(function(d){
      return d.username !=req.user.username;
    })
    res.status(200).json({ success: true, users:data });
  });
}

exports.editDetails = async (req, res, next) => {
  console.log("edit profile",req.body);
  const { avatar, username, fullname, website, bio, cover } = req.body;

  const fieldsToUpdate = {};
  if (avatar) fieldsToUpdate.avatar = avatar;
  if (username) fieldsToUpdate.username = username;
  if (fullname) fieldsToUpdate.fullname = fullname;
  if (cover) fieldsToUpdate.cover = cover;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { ...fieldsToUpdate, website, bio },
    },
    {      
      new:true,
      runValidators: true,
    }
  ).select("avatar cover username fullname bio website");
  console.log(user);
  setTimeout(()=>{
  res.status(200).json({ success: true, user: user });
},1000)
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
      res.status(200).json({ success: true, messsage: "check your email for the OTP" });
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
  //////console.log(req.body);
  const otpif = await OTPmodel.findOne({ email: req.user.email, type: "changepassword", OTP: otp });
  //////console.log(req.user.email,otp);  
  if (otpif) {
    const user = await User.findOne({ email: req.user.email });
    const tempid = generateOTP(16);
    user.socketId = [];
    await user.updatePassword(password, tempid);
    await user.save();
    const token = await user.getJwtToken();
    otpif.remove();
    res.status(200).json({ success: true, token: token, message: "Password changed successfully" });

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
      res.status(200).json({ success: true, notices });
    })
  }
  else
    return next({ success: false, message: "Unable to verify user" });
}

exports.subscribe = async (req, res, next) => {
  // make sure the user exists
  const user = await User.findById(req.params.id);
  let bool = false;

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
    bool = false;
    const noti = await Notification.find({Message: `${req.user.username} subscribed to your channel`});
    if(noti[0]){
      for(const i of noti[0].receiver)
        await User.findByIdAndUpdate(i,{
          $pull:{unseennotice:noti._id}
        })
    }
    for(t of noti){
      t.remove();
    }
  }
  else {
    await User.findByIdAndUpdate(req.params.id, {
      $push: { subscribers: req.user.id },
    });
    bool = true;
    const noti = await Notification.create({
      sender: req.user.id,
      receiver: [req.params.id],
      avatar:req.user.avatar,
      video: req.user.video,
      type: "subscription",
      url: `/user/${req.user._id}`,
      Message: `${req.user.username} subscribed to your channel`
    })
    if(!user.unseennotice.includes(noti._id))
      user.unseennotice.push(noti._id);
  }
  const user2 = await User.findById(req.user.id);
  if (user2.subscribedto.includes(req.params.id)) {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedto: req.params.id },
    });
  }
  else {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedto: req.params.id },
    });
  }
  const me = await User.findById(req.user.id).populate({
    path:"subscribedto",
    select:"username avatar"
  });

  res.status(200).json({ success: true, isSubscribed:bool,subscribedto:me.subscribedto });
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
  else {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribers: req.params.id },
    });
    await Notification.findOneAndDelete({
      sender: req.params.id,
      receiver: [req.user.id],
      type: "subscription"
    }, function (err, res) {
      if (err){
        console.log(err, "\ndetected on line 202 controllers/user")
      }
    })
  }
  const user2 = await User.findById(req.user.id);
  if (user2.subscribedto.includes(req.params.id)) {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedto: req.params.id },
    });
  }
  else {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedto: req.params.id },
    });
  }

  res.status(200).json({ success: true, data: {} });
}
exports.savevideo = async (req, res, next) => {
  const isVideoavailable = await Video.findById(req.params.vid);
  if (!isVideoavailable || !checkAccessibility(req, isVideoavailable)) {
    return next({
      statusCode: 400,
      message: "Action failed"
    })
  }
  const issaved = await savedVideo.findOne({ Videoid: req.params.vid, userid: req.user.id });
  if (issaved) {
    await issaved.remove();
  }
  else {
    await savedVideo.create({ Videoid: req.params.vid, userid: req.user.id });
  }
  res.status(200).json({ success: true });

}
exports.feed = async (req, res, next) => {
  let videos = await Video.find({}).populate({
    path: "organiser",
    select: "username subscribers avatar"
  }).sort("-createdAt")
    .lean()
    .exec();
  videos = videos.filter(function (v) {
    return checkAccessibility(req, v);
  });
  videos.forEach(async function (v) {
    v.isLiked = v.likedBy.includes(req.user.id);
    v.organiser.subscriber = [];
    const isSaved = await savedVideo.findOne({ userid: req.user.id, Videoid: v._id });
    if (isSaved) {
      v.isSaved = true
    }
    else {
      v.isSaved = false;
    }

  })
  if(req.body.limit){
    const limit = parseInt(req.body.limit);
    req.user.subscribedto = [];
    videos = videos.slice(0,limit);
  }
  res.status(200).json({ success: true,subscribedto:req.user.subscribedto, videos });

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
    .then(json => //console.log(json))
    .catch(err => //console.error(err));
}

*/

exports.uploadVideo = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return;
  }
  try {
    //Use the name of the input field (i.e. "video") to retrieve the uploaded file
    const { url, title, description, keywords } = req.body;
    //console.log(req.body);
    //const name = generateOTP(6)+"_"+title;
    const video2 = await Video.create({
      description: description,
      title: title,
      accessibility: req.body.accessibility || [],
      url: url,
      keywords: keywords,
      visibility: req.body.visibility || "public",
      organiser: user._id
    });
    //video2.url = `/uploads/${video2._id.toString()}`;
    await video2.save();
    user.videos.push(video2._id);
    await user.save();
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    //video.mv('../uploads/' +name);            
    await Notification.deleteMany({ receiver: [] }, (err, res) => { });
    const notice = await Notification.create({
      sender: req.user.username,
      receiver: req.body.visibility == "custom" ? req.body.accessibility : req.user.subscribers,
      Message: req.body.visibility == "custom" ? `${req.user.fullname}(channel-${req.user.username}) has uploaded a private video` : `Your channel ${req.user.username} uploaded a video ${req.body.title}|${req.body.description}`,
      type: "videoupload",
      VideoId: video2._id,
      url: "/video/"+video2._id,
      avatar: req.user.avatar
    })

    for (const i of notice.receiver) {
      User.findByIdAndUpdate(i, {
        $push: { unseennotice: notice._id }
      })
    }
    if (notice.receiver.length == 0) {
      notice.remove();
    }

    //send response
    // res.send({
    //     status: true,
    //     message: 'File is uploaded',
    //     data: {
    //         name: video.name,
    //         mimetype: video.mimetype,
    //         size: video.size
    //     }
    // });
    res.status(200).json({ success: true });

  } catch (err) {
    //console.log(err);
    res.status(500).send(err);
  }


}