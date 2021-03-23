const express = require("express");
const cors = require("cors");
const {startSocket} = require("./utils/socketconnection");
const helmet = require("helmet");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const video = require("./routes/video");
const user = require("./routes/user");
const errorHandler = require("./middlewares/errorHandler");
const DB = require("./utils/db.config");

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
startSocket();

app.use("/auth", auth);
app.use("/admin", admin);
app.use("/videos", video);
app.use("/users", user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
exports.server = app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));

