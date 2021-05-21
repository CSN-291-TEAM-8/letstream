const jwt = require('jsonwebtoken');
const User = require("../models/User");
//const Chat = require("../models/Chat");
//const Message = require("../models/Message");
//const Notification = require("../models/Notification");
var ws, ioc;
//var si = {};
var path = require('path');
//var dataUriToBuffer = require('data-uri-to-buffer');
//var fs = require("fs");
//const { generateOTP } = require("../controllers/auth");
const LiveVideo = require('../models/LiveVideo');
const Notification = require('../models/Notification');



exports.startSocket = async function (server) {
  
  const io = require("socket.io")(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cors: {
      origin: process.env.NODE_ENV == 'production' ? process.env.SERVER_URL : '*',
    }
  });

  io.use(async (socket, next) => {
    try {
      if (socket.handshake.query.token) {
        const decoded = await jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET);
        socket.uid = decoded.id;
        socket.tempid = decoded.tempid;
        next();
      }
    }
    catch (err) {
      console.log("socket connection failed \nMessage --->" + err.message);
    }
  });
  io.on("connection", async function (socket) {
    const clearSocketId = async ()=>{
      const u = await User.find({});
      for(const i of u){
        i.socketId = [];
        await i.save();
      }
    }
    const clearParticipants = async ()=>{
      const l = await LiveVideo.find({});
      for(const i of l){
         i.participants = [];
         await i.save();
      }
    };
    //clearSocketId();

    //clearParticipants();
    const checkAccessibility2 = (req,video)=>{
      if(!video||!video.organiser){
        return false;
    }
      const organiser = video.organiser;
      //console.log(organiser);
      return video.visibility == "public" || video.organiser._id.toString() == req.user.id.toString() || (video.visibility == "sub-only" && organiser.subscribers.toString().indexOf(req.user.id.toString()) > -1)
          || (video.visibility == "custom" && video.accessibility.indexOf(req.user.id.toString()) > -1)
    }
    console.log("socket working fine");
    await User.findOneAndUpdate({ _id: socket.uid, tempid: socket.tempid }, {
      $push: { socketId: socket.id }
    });
    ws = socket;
    socket.on("endmeeting",async function(){
      if(!socket.liveroomid){
        socket.emit("errmsg","Could not end live broadcast");
        return;
      }
      const live = await LiveVideo.findOne({roomid:socket.liveroomid,organiser:socket.uid});
      if(!live){
        socket.emit("errmsg","Could not end live broadcast");
        return;
      }
      console.log("Ending event...");
      await live.remove();
      await Notification.deleteMany({url:"/livestreaming/"+live.roomid},(err,res)=>{});
      io.to(socket.liveroomid).emit("meetingended",socket.liveroomid);
    });
    socket.on("joinliveroom", async function(room){
      if(socket.liveroomid){
        return;
      }
      const user = await User.findById(socket.uid);
      const live = await LiveVideo.findOne({ roomid: room }).populate({
        path: "organiser",
        select: "subscribers"
      });
      console.log("joining room");
      if (checkAccessibility2({ user: user }, live)) {
        socket.liveroomid = room;
        socket.username = user.username;
        socket.avatar = user.avatar;
        socket.join(room);
        console.log("joined room " + room);
      }
      else {
        socket.liveroomid = null;
        socket.username = null;
        socket.avatar = null;
        socket.emit("errmsg", "Could not join room");

      }

    });
    socket.on("chat",function(msg){
      console.log("chat");
       io.to(socket.liveroomid).emit("msg",{text:msg,username:socket.username,avatar:socket.avatar});
    })
    socket.on("leave", (room) => {
      socket.leave(room);
      socket.liveroomid = null;
      console.log("left room " + room);
    });

    socket.on("broadcaster",async function () {
      console.log("broadcaster fired",socket.liveroomid);
      if(!socket.liveroomid){
        socket.emit("errmsg","Failed to establish connection");
      }
      await LiveVideo.findOneAndUpdate({roomid:socket.liveroomid},{
        $push:{participants:socket.uid}
      });
      
      socket.broadcast.to(socket.liveroomid).emit("broadcaster",socket.id);
    });

    socket.on("watcher",async function () {
      console.log("watcher fired",socket.liveroomid);
      if(!socket.liveroomid){
        socket.emit("errmsg","Failed to establish connection");
      }
      await LiveVideo.findOneAndUpdate({roomid:socket.liveroomid},{
        $push:{participants:socket.uid}
      });
      console.log(socket.liveroomid);
      
      socket.broadcast.to(socket.liveroomid).emit("watcher",socket.id);
    });

    socket.on("candidate", function (id,me, candidate) {
      io.to(id).emit("candidate", me, id, candidate);
      //console.log(candidate+"--->"+me+"---->"+id);
    });

    socket.on("offer", function (id,me, localdes) {
      console.log("offer fired");
      io.to(id).emit("offer",me, id, localdes);
    });

    socket.on("answer", function (id,me, answer) {
      console.log("answer fired");
      io.to(id).emit("answer", me , answer);
    });
    socket.on('disconnect', async function () {
      await LiveVideo.findOneAndUpdate({roomid:socket.liveroomid},{
        $pull:{participants:socket.uid}
      });
      await User.findOneAndUpdate({ _id: socket.uid }, {
        $pull: { socketId: socket.id }
      });
      socket.broadcast.to(socket.liveroomid).emit("disconnectPeer",socket.id);
      console.log(socket.id + ' disconnected ' + socket.uid);
    })

    //             MAIN__PART ___APPEARED ___ABOVE          

  });
  ioc = io;
}

exports.SOCKET = function () {
  return ws;
}
exports.IO = function () {
  return ioc;
}