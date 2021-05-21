require("dotenv").config();
const express = require("express");
const cors = require("cors");

const helmet = require("helmet");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const video = require("./routes/video");
const user = require("./routes/user");
const chat = require("./routes/chat");
const errorHandler = require("./middleware/errorhandle");
const DB = require("./utils/db.config");
const User = require("./models/User");
const { startSocket } = require("./utils/socketconnection");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet.frameguard({ action: 'DENY' }));
app.use(function (req, res, next) {
    if (process.env.NODE_ENV === "production"){
      res.setHeader('Access-Control-Allow-Origin', process.env.SERVER_URL);
      app.use(express.static('client/build'));
      const path = require('path');
      app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'), { lastModified: false });
  })
    }
    if ((req.get('X-Forwarded-Proto') !== 'https' && process.env.NODE_ENV == "production")) {
      res.redirect('https://' + req.get('Host') + req.url);
    } else
      next();
  });
DB();

const clearSubs = async ()=>{
 const users =  await User.find({});
 for(x of users){
   x.subscribedto = [];
   x.subscribers = [];
   await x.save();
 }
}
app.use("/api/v1/auth", auth);
app.use("/api/v1/admin", admin);
app.use("/api/v1/chat",chat);
app.use("/api/v1/video", video);
app.use("/api/v1/user", user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, function(){console.log(`Server started at http://localhost:${PORT}`)});
startSocket(server);
