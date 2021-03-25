const express = require("express");
const router = express.Router();
const { deleteUserId,deleteVideo } = require("../controllers/admin");
const { Verify } = require("../middleware/auth");

router.route("/deleteVideo/:videoid").post(Verify,deleteVideo);
router.route("/deleteUserId/:userid").post(Verify,deleteUserId);

module.exports = router;