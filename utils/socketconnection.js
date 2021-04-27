const server = require("../server");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
var ws,ioc;
var si = {};
var path = require('path');
var dataUriToBuffer = require('data-uri-to-buffer');
var fs = require("fs");
const { generateOTP } = require("../controllers/auth");
 
exports.startSocket = async function(){
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
      io.on("connection",async function (socket) {
        
        await User.findOneAndUpdate({ _id: socket.uid, tempid: socket.tempid }, {
            $push: { socketId: socket.id }
          });
          ws = socket;
          socket.on("join",(room)=>{
            socket.join(room);
            console.log("joined room "+room);
          })
          socket.on("leave",(room)=>{
            socket.leave(room);
            console.log("left room "+room);
          }); 
          socket.on("initiatestreaming",async function(data){            
            const name = "stream_"+generateOTP(6);
            const user = await User.findById(socket.uid);
            if(!user){
              socket.emit("err");
              return;
            }
            const video2 = await Video.create({
                description:data.description,
                title:data.title,
                presentors:data.presentors,
                servername:name,                
                keywords:data.keywords,
                visibility:data.visibility,
                accessibility:data.accessibility,
                oraganiser:user._id
            });
            video2.url = `/streams/${video2._id.toString()}`;
            await video2.save();
            //create notices to presenters,tagged people or subscribers whatever appropriate          
            await Notification.create({
              sender:req.user.username,
              receiver:req.body.visibility=="custom"?req.body.accessibility:req.user.subscribers,
              Message:req.body.visibility=="custom"?`${req.user.fullname}(channel-${req.user.username}) has invited you to watch a privately uploaded video`:`Your channel ${req.user.username} uploaded a video ${req.body.title}|${req.body.description}`,
              type:"videoupload",
              VideoId:video2._id,
              url:video2.url,
              avatar:req.user.avatar
          })  

            await Notification.create({
                sender:req.user.username,
                receiver:req.user.presenters,
                Message:`You have been appointed as a presenter by ${req.user.username} for a live stream video ${req.body.title}|${req.body.description}`,
                type:"videostream",
                VideoId:video2._id,
                url:video2.url,
                avatar:req.user.avatar
            })
            socket.emit("readytostream",name);
          })
          // client side code

          // import io from 'socket.io-client';
          // import ss from 'socket.io-stream';
           
          // var socket = io.connect('http://localhost:55000');
          // var stream = ss.createStream();
          // 
          // const stream = await navigator.mediaDevices..getUserMedia({video:true,audio:true});
          // ss(socket).emit('streaming', stream, {name: filename});
          // fs.createReadStream(filename).pipe(stream);

          socket.on('streaming', function(data) {
            var filename = path.join(__dirname,"../uploads/"+data.name);
            socket.broadcast.to(data.name).emit("getstream",data.data);//data is videoname
            fs.appendFile(filename,dataUriToBuffer(data.data),(err)=>{console.log(err,"\nat line 103 socketconnection.js")});
          });
          
          socket.on('disconnect', async function () {
            await User.findOneAndUpdate({ _id: socket.uid }, {
              $pull: { socketId: socket.id }
            });
            ////console.log(socket.id + ' disconnected ' + socket.uid);
          })
          //----------------------------HANDLE CHAT PART -----------------------------

          socket.on('requestverification', async function (data) {
            const userit = await User.findById(socket.uid);
            if (userit.tempid != socket.tempid) {
              socket.emit('errormsg', "Please login again");
              return;
            }
            const ifnew = await Chat.findOne({ name: data }).populate({
              path: "participants",
              select: "avatar username socketId"
            }).populate({
              path: "messages",
              select: "createdAt text"
            });
            //////console.log("ifnew", ifnew);
            if (ifnew && ifnew.participants.toString().includes(socket.uid) && userit) {
              for (i of userit.socketId)
                io.to(i).emit('addnewlist', { avatar: ifnew.participants.filter((user) => user._id.toString() != socket.uid)[0].avatar, username: ifnew.participants.filter((user) => user._id.toString() != socket.uid)[0].username, lastmessage: ifnew.messages[ifnew.messages.length - 1].text, timeSince: ifnew.messages[ifnew.messages.length - 1].createdAt, uri: "/chat/t/" + data, id: ifnew._id });
              //////console.log('request verified for room ' + data);
            }
          })
          socket.on('connect', async function () {
            await User.findOneAndUpdate({ _id: socket.uid, tempid: socket.tempid }, {
              $push: { socketId: socket.id }
            });
          })
          socket.on('read', async function (data) {
            const userdetail = await Chat.findOne({ name: data }).populate({
              path: "participants",
              select: "unseenmsg socketId username",
            }).populate({
              path: "messages",
              select: "owner"
            });
            if (!userdetail.participants.toString().includes(socket.uid)) {
              return;
            }
            const curruser = await User.findById(socket.uid);
            const otheruser = userdetail.participants.filter(function (a) {
              return a._id.toString() != socket.uid
            })
            // //////console.log('otheruser-->',otheruser);
            for (i in curruser.unseenmsg) {
              // //////console.log(curruser,data);
              if (curruser.unseenmsg[i].split("=")[0] == data) {
                curruser.unseenmsg.splice(i, 1);
              }
        
            }
            let um = curruser.unseenmsg;
            um = um.map(x => x = x.split("=")[0]);
            //console.log("new", curruser.unseenmsg);
            await curruser.save();
            for (i of curruser.socketId) {
              io.to(i).emit('updatestate', { length: [... new Set(um)].length, data: data })
            }
            let status = false;
        
            //um.forEach(x=>x=x.split("=")[0]);
            if (userdetail.messages.length > 1)
              status = userdetail.messages[userdetail.messages.length - 1].owner.toString() === socket.uid && curruser.unseenmsg.toString().indexOf(data) == -1
            for (i of otheruser[0].socketId) {
              io.to(i).emit('readmsg', status);
            }
        
          })
          socket.on('msg', async function (data) {
        
            const userdetail = await Chat.findOne({ name: data.roomid }).populate({
              path: "participants",
              select: "socketId avatar fullname unseenmsg",
            });
        
            ////////console.log("detail\n\n\n"+userdetail);
            const user = await User.findById(socket.uid);
            if (user.tempid != socket.tempid) {
              socket.emit('errormsg', "Please login again");
              return;
            }
            if (!userdetail || !userdetail.participants.toString().includes(socket.uid) || !user) {
              //socket.emit("deletelast");
              return;
            }
            const otheruser = userdetail.participants.filter(function (a) {
              return a._id.toString() != socket.uid
            })[0];
        
            const message = await Message.create({ owner: user._id, text: data.message, roomid: data.roomid });
            otheruser.unseenmsg.push(data.roomid + "=" + message._id);
            let um = otheruser.unseenmsg;
            um = um.map(x => x = x.split("=")[0]);
        
            for (i of otheruser.socketId) {
        
              io.to(i).emit('updatestate', { length: [... new Set(um)].length, data: data.roomid, um })
            }
            if (user.socketId.indexOf(socket.id) == -1)
              user.socketId.push(socket.id);
            //////console.log(socket.id);
            await user.save();
        
            await otheruser.save();
            await Chat.findOneAndUpdate({ name: data.roomid }, {
              $push: { messages: message._id }
            });
            const fullname = userdetail.participants.filter((u) => u._id.toString() === socket.uid)[0].fullname
            for (x of userdetail.participants) {
              for (i of x.socketId)
                io.to(i).emit("msg", { createdAt: message.createdAt, isVideo: data.isVideo, isImage: data.isImage, roomid: data.roomid, text: message.text, isMine: message.owner.toString() == x._id.toString(), _id: message._id.toString(), sender: fullname, chatRoomid: userdetail._id.toString(), unseenmsglength: otheruser.unseenmsg.filter(x => x.split("=")[0] == data.roomid).length })
            }
            userdetail.lastupdated = Date.now();
            await userdetail.save();
        
          })
          socket.on('delete', async function (data) {
            const user = await User.findById(socket.uid);
            if (!user)
              return;
            if (user.tempid != socket.tempid) {
              socket.emit('errormsg', "Please login again");
              return;
            }
            if (user.socketId.indexOf(socket.id) == -1)
              user.socketId.push(socket.id);
            await user.save();
            const message = await Message.findById(data.msgId);
            const users = await Chat.findOne({ name: data.roomid }).populate({
              path: "participants",
              select: "socketId unseenmsg"
            });
        
            const otheruser = users.participants.filter(function (a) {
              return a._id.toString() != socket.uid
            })[0];
            ////console.log("msgid",data.msgId,"unseenmsg",otheruser.unseenmsg);
            const index = otheruser.unseenmsg.indexOf(data.roomid + "=" + data.msgId);
            index > -1 && otheruser.unseenmsg.splice(index, 1);
            await otheruser.save();
            //////console.log("socketid", socket.id);
            if (!message || !users || !user) {
              socket.emit('errormsg', "No msg found");
              return;
            }
        
            if (message.owner.toString() != socket.uid) {
              socket.emit("errormsg", "You are not authorised to delete this message");
              return;
            }
            await Chat.findOneAndUpdate({ name: data.roomid }, {
              $pull: { messages: data.msgId }
            });
            await message.remove();
            for (x of users.participants) {
              for (i of x.socketId)
                io.to(i).emit('deletingmsg', { msgId: data.msgId });
              //socket.emit('deletingmsg',{msgId:data.msgId});
            }
            // //////console.log(data);
          })
          
          



          //-------------------------------- HANDLE CALL REQUEST-------------------------------
        




          socket.on('startcall', async function (data) {
            if (si[data.from + "_" + data.to])
              return;
            ////console.log("call started", data);
            let from = await User.findById(data.from);
            let to = await User.findById(data.to);
            ////////console.log("startcall ",data);
            if (!to || !from) {
              socket.emit('err', data.from);
              ////console.log("return");
              return;
            }
        
            si[data.from + "*" + data.to] = 0;
            si[data.from + "r" + data.to] = false;
            si[data.from + "_" + data.to] = setInterval(async function () {
              si[data.from + "*" + data.to]++;
              to = await User.findById(data.to);
              if (si[data.from + "*" + data.to] > 26) {
                clearInterval(si[data.from + "_" + data.to]);
                si[data.from + "_" + data.to] = null;
                si[data.from + "*" + data.to] = null;
                socket.emit('noresponse', data.to);
                typeofcall = data.video ? "video" : "voice";
                await Notification.deleteMany({ Message: `You missed a ${typeofcall}-call from ${from.username}`, receiver: [data.to] }, (err, res) => { });
                const noti = await Notification.create({
                  url: "/" + from.username,
                  type: typeofcall + "callmiss",
                  avatar: from.avatar,
                  sender: data.from,
                  Message: `You missed a ${typeofcall}-call from ${from.username}`,
                  receiver: [data.to]
                });
                //to.unseenmsg = [];
                to.unseennotice.push(noti._id);
                await to.save();
                for (let i of to.socketId) {
                  io.to(i).emit('removecallingmodel',);
                }
        
              }
              else {
                ////console.log(si);
                if (!si[data.from + "r" + data.to])
                  for (let i of to.socketId) {
                    (!si[data.from + "r" + data.to]) && io.to(i).emit('getcallrequest', { video: data.video, from: from.fullname, avatar: from.avatar, fromid: data.from, toid: data.to, fromsocketId: socket.id });
                  }
              }
        
            }, 1500);
            ////////console.log(si);
          })
          socket.on('confirmation', async function (data) {
            ////////console.log(si);  
        
        
            //////console.log("t");
            const from = await User.findById(data.from);
            ////////console.log(from);
            for (const i of from.socketId) {
              io.to(i).emit('receivedresponse', data.to);
            }
          });
          socket.on("callaborted", async function (data) {
            const to = await User.findById(data.to);
            const from = await User.findById(data.from);
            if (!to) {
              return;
            }
            if (data.generateNotice) {
              typeofcall = data.video ? "video" : "voice";
              await Notification.deleteMany({ Message: `You missed a ${typeofcall}-call from ${from.username}`, receiver: [data.to] }, (err, res) => { });
              const noti = await Notification.create({
                url: "/" + from.username,
                type: typeofcall + "callmiss",
                avatar: from.avatar,
                sender: data.from,
                Message: `You missed a ${typeofcall}-call from ${from.username}`,
                receiver: [data.to]
              });
              //to.unseenmsg = [];
              to.unseennotice.push(noti._id);
              await to.save();
            }
            ////console.log(data);
            si[data.from + "_" + data.to] && clearInterval(si[data.from + "_" + data.to]);
            si[data.to + "_" + data.from] && clearInterval(si[data.to + "_" + data.from]);
            si[data.from + "_" + data.to] = null;
            si[data.from + "*" + data.to] = null;
            si[data.to + "_" + data.from] = null;
            si[data.to + "*" + data.from] = null;
            for (const t of to.socketId) {
              io.to(t).emit('removecallingmodel');
              io.to(t).emit('failedcall', data.from);
              setTimeout(function () {
                io.to(t).emit('removecallingmodel');
              }, 1000);
            }
          })
          socket.on("changesocketid", async function (data) {
            let to = await User.findById(data.to);
            if (!to) {
              return;
            }
            for (let i of to.socketId) {
              io.to(i).emit("changesocketid", { newid: socket.id, uid: data.from });
            }
          })
          socket.on('callresponse', async function (data) {
            //////console.log("callresponse ",data);
            const from = await User.findById(data.from);
            const to = await User.findById(data.to);
            if (!to || !from) {
              return;
            }
            if (data.rejected) {
              //////console.log(from);
              si[data.from + "r" + data.to] = true;
              for (const i of from.socketId) {
                io.to(i).emit('callrejected', data.to);
                setTimeout(function () {
                  io.to(i).emit('callrejected', data.to);
                }, 800);
              }
            }
            // else{
            //   for(const i of from.socketId){
            //     data.id = socket.id;
            //     io.to(i).emit('sdp',data);
            //   }
            // }
            clearInterval(si[data.from + "_" + data.to]);
            si[data.from + "_" + data.to] = null;
            si[data.from + "*" + data.to] = null;
            for (const i of to.socketId) {
              io.to(i).emit('removecallingmodel');
              setTimeout(function () {
                io.to(i).emit('removecallingmodel');
              }, 1000);
            }
          })
          socket.on("sdp", function (data) {
            data.id = socket.id;
            ////console.log("sdp-data", data.target);
            io.to(data.target).emit("sdp", data);
          })
          socket.on("endcall", async function (data) {
            const to = await User.findById(data.to);
            const from = await User.findById(data.from);
            if (!to || !from) {
              return;
            }
            for (const i of to.socketId) {
              io.to(i).emit("endcall", data);
            }
          });
          socket.on("micaction", async function (data) {
            ////console.log("mic ", data);
            const to = await User.findById(data.to);
            for (const i of to.socketId) {
              io.to(i).emit("micaction", data);
            }
          })
          socket.on("candidate", function (data) {
            data.id = socket.id;
            ////console.log("candidate-data", data.target);
            io.to(data.target).emit("candidate", data);
          })
          socket.on("answer", function (data) {
            data.id = socket.id;
            ////console.log("answer-data", data.target);
            io.to(data.target).emit("answer", data);
          })
    
      });
      ioc = io;
}

  exports.SOCKET = function(){
    return ws;
  }
  exports.IO = function(){
    return ioc;
  }