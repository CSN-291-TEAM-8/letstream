const express = require('express');
const { getConversationDetail, receiveUser, createNew, filterUser, giveDetail } = require('../controllers/chat');
const { Verify } = require('../middleware/auth');

const router = express.Router();

router.route("/:roomid").post(Verify, getConversationDetail);
router.route("/getuser").get(Verify, receiveUser);
router.route('/getdetail/:id').get(Verify, giveDetail);
router.route('/getuser/:text').get(Verify, filterUser);
router.route('/new/:id').post(Verify, createNew);
module.exports = router;