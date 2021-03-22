const express = require("express");

const router = express.Router();
const {  
  getPost,  
  deletePost,
  Highlight,
  toggleLike,
  toggledislike,  
  addComment,
  deleteComment,
  reportVideo,
  searchVideo,
} = require("../controllers/post");
const { Verify } = require("../middleware/auth");

router.route("/search").get(Verify,searchVideo);
router.route("/highlight").get(Verify,Highlight);
router.route("/:id").get(Verify, getPost).delete(Verify, deletePost);
router.route("/:id/togglelike").get(Verify, toggleLike);
router.route("/:id/toggledislike").get(Verify, toggledislike);
router.route("/:id/comments").post(Verify, addComment);
router.route('/report/:id').post(Verify,reportVideo);
router.route("/:id/comments/:commentId").delete(Verify, deleteComment);

module.exports = router;