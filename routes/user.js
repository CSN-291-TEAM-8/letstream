const express = require("express");
const router = express.Router();
const { uploadVideo,editDetails,changePassword,requestotp,feed,sendNotice,subscribe,removeSubscriber ,searchUser,getUser} = require("../controllers/auth");
const { Verify } = require("../middleware/auth");

router.route("/").get(Verify, getUsers);
router.route("/").put(Verify, editDetails);
router.route('/changepassword').post(Verify,changePassword);
router.route('/requestpasswordotp').post(Verify,requestotp);
router.route("/notice").post(Verify,sendNotice);
router.route("/feed").get(Verify, feed);
router.route("/uploadvideo").post(Verify,uploadVideo);//if it's not live streaming
router.route("/:username").get(Verify, getUser);
router.route("/subscribe").post(Verify,subscribe);
router.route("/removesubscriber").post(Verify,removeSubscriber);
router.route("/search/:reg").get(searchUser);

module.exports = router;