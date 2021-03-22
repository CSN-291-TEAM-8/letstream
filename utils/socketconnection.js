const server = require("../server");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
var ws;

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
  io.on("connection", function (socket) {
    await User.findOneAndUpdate({ _id: socket.uid, tempid: socket.tempid }, {
        $push: { socketId: socket.id }
      });
      ws = socket;

  });

  module.exports = ws;