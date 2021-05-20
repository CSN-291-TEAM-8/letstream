const express = require("express");
const router = express.Router();
const { uploadVideo,editDetails,changePassword,requestotp,feed,sendNotice,subscribe,removeSubscriber ,searchUser,getUser,savevideo, addtoViewedVideo,getHistory,getSuggestions,getMyVideos,
getsavedVideos,getLiveVideos,getlikedVideos, removeFromHistory, createLiveStream,getLiveInfo} = require("../controllers/user");

const { Verify } = require("../middleware/auth");

router.route("/").put(Verify, editDetails);

router.route('/changepassword').post(Verify,changePassword);
router.route('/requestpasswordotp').post(Verify,requestotp);

router.route("/notifications").post(Verify,sendNotice);
router.route("/history").post(Verify,getHistory);
router.route("/suggestions").post(Verify,getSuggestions);
router.route("/myvideos").post(Verify,getMyVideos);
router.route("/savedvideos").post(Verify,getsavedVideos);
router.route("/likedvideos").post(Verify,getlikedVideos);
router.route("/livevideos").post(Verify,getLiveVideos);
router.route("/feed").post(Verify, feed);

router.route("/uploadvideo").post(Verify,uploadVideo);//if it's not live streaming
router.route("/createlivestream").post(Verify,createLiveStream);
router.route("/getstreaminfo/:roomid").get(Verify,getLiveInfo);
router.route("/getuserbyid").post(Verify, getUser);
router.route("/subscribe/:id").post(Verify,subscribe);
router.route("/savevideo/:vid").get(Verify,savevideo);
router.route("/addtohistory/:url").get(Verify,addtoViewedVideo);
router.route("/removefromhistory/:vid").delete(Verify,removeFromHistory);

router.route("/removesubscriber/:id").post(Verify,removeSubscriber);
router.route("/search").post(Verify,searchUser);

module.exports = router;