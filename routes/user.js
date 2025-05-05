const express = require('express');
const router = express.Router();
const { verifyToken } = require('../config/auth');

const AuthController = require('../app/controllers/AuthController');
const AdsController = require('../app/controllers/User/AdsController');
const ClassController = require('../app/controllers/User/ClassesController');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/resend-otp', AuthController.resendOtp);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-reset-otp', AuthController.verifyResetOtp);
router.post('/reset-password', AuthController.userResetPassword);

router.use(verifyToken);
router.post('/logout', AuthController.logout);

router.post("/ads/list", AdsController.adsList);

router.post("/class/view", ClassController.viewClass);
router.post("/class/list", ClassController.classList);

module.exports = router;