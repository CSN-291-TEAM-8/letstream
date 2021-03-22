const express = require("express");
const router = express.Router();
const { deleteUserId,deleteVideo } = require("../controllers/auth");
const { Verify } = require("../middleware/auth");

router.route("/deleteVideo").post(deleteVideo);
router.route("/deleteUserId").post(deleteUserId);

module.exports = router;