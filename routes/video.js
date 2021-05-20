const express = require("express");

const router = express.Router();
const {  
  getvideo,  
  sendvideoinfo,
  deletevideo,
  Highlight,
  toggleLike,
  toggledislike,  
  addComment,
  likecomment,
  dislikecomment,
  deleteComment,
  reportVideo,
  searchVideo,
  addoneView,
  editVideo,
} = require("../controllers/video");
const { Verify } = require("../middleware/auth");

router.route("/search").post(Verify,searchVideo);
router.route("/trending").post(Verify,Highlight);

router.route("/:id").get(Verify, getvideo).delete(Verify, deletevideo);
router.route("/getinfo/:id").get(Verify,sendvideoinfo);
router.route("/addoneView/:url").get(Verify,addoneView);
router.route("/:id/togglelike").get(Verify, toggleLike);
router.route("/editVideo/:vid").post(Verify,editVideo);
router.route("/:id/toggledislike").get(Verify, toggledislike);
router.route("/:id/comments").post(Verify, addComment);
router.route('/report/:id').post(Verify,reportVideo);
router.route("/:id/comments/:commentId").delete(Verify, deleteComment);
router.route("/:cid/likecomment").post(Verify,likecomment);
router.route("/:cid/dislikecomment").post(Verify,dislikecomment);

module.exports = router;