/** @format */

const express = require('express');
const router = express.Router();
const { handleLogin } = require('../../controllers/authController');
const {
	requestOtp,
	verifyOtp,
	saveOnboarding,
} = require('../../controllers/otpAuthController');
const verifyJWT = require('../../middleware/verifyJWT');

router.post('/', handleLogin);
router.post('/otp/request', requestOtp);
router.post('/otp/verify', verifyOtp);
router.post('/onboarding', verifyJWT, saveOnboarding);

module.exports = router;
