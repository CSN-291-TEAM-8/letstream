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
} = require("../controllers/video");
const { Verify } = require("../middleware/auth");

router.route("/search/:title").get(Verify,searchVideo);
router.route("/highlight").get(Verify,Highlight);
router.route("/:id").get(Verify, getvideo).delete(Verify, deletevideo);
router.route("/getinfo/:id").post(Verify,sendvideoinfo);
router.route("/:id/togglelike").get(Verify, toggleLike);
router.route("/:id/toggledislike").get(Verify, toggledislike);
router.route("/:id/comments").post(Verify, addComment);
router.route('/report/:id').post(Verify,reportVideo);
router.route("/:id/comments/:commentId").delete(Verify, deleteComment);
router.route("/:cid/likecomment").post(Verify,likecomment);
router.route("/:cid/dislikecomment").post(Verify,dislikecomment);

module.exports = router;