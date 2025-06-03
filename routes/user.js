const express = require('express');
const router = express.Router();
const { verifyToken } = require('../config/auth');

const AchievementController = require('../app/controllers/User/AchievementController');
const AuthController = require('../app/controllers/AuthController');
const AdsController = require('../app/controllers/User/AdsController');
const ClassController = require('../app/controllers/User/ClassesController');
const CentreController = require('../app/controllers/User/CentreController');
const WorkoutController = require('../app/controllers/User/WorkoutController');

router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);
router.post('/verify-otp', AuthController.verifyOTP);
router.post('/resend-otp', AuthController.resendOtp);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/verify-reset-otp', AuthController.verifyResetOtp);
router.post('/reset-password', AuthController.userResetPassword);

router.use(verifyToken);
router.post('/profile', AuthController.getProfile);
router.post('/profile/edit', AuthController.updateUserProfile);
router.post('/change-password', AuthController.changePassword);
router.post('/logout', AuthController.logout);

router.post('/estimate-calorie', WorkoutController.estimateCalories);
router.post('/workout-log/create', WorkoutController.logWorkout);
router.post('/workout-log/update', WorkoutController.editLog);
router.post('/workout-log/view', WorkoutController.viewLog);
router.post('/workout-log/delete', WorkoutController.deleteLog);
router.post('/workout-log/list', WorkoutController.logList);
router.post('/generate-workout', WorkoutController.generateWorkout);

router.post("/achievement/list", AchievementController.userAchievements);

router.post("/ads/list", AdsController.adsList);

router.post("/class/view", ClassController.viewClass);
router.post("/class/register", ClassController.registerClass);
router.post("/class/register-list", ClassController.userClassList);
router.post("/class/list", ClassController.classList);

router.post("/centre/view", CentreController.viewCentre);
router.post("/centre/list", CentreController.centreList);

module.exports = router;