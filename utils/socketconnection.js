const server = require("../server");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
var ws,ioc;

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
    
      });
      ioc = io;
}

  exports.SOCKET = function(){
    return ws;
  }
  exports.IO = function(){
    return ioc;
  }