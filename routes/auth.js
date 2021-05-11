const express = require("express");
const router = express.Router();
const { login, signup, me,OTPVerify, changepassword, requestOTPForPwChange } = require("../controllers/auth");
const { Verify } = require("../middleware/auth");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/me").get(Verify, me);
router.route("/forgetpassword").post(changepassword);
router.route('/recoveryOTP').post(requestOTPForPwChange);
router.route('/OTPrequest').post(OTPVerify);

module.exports = router;