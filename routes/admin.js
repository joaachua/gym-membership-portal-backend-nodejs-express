const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../config/auth');

const AuthController = require('../app/controllers/AuthController');
const AdsController = require('../app/controllers/Admin/AdsController');
const ClassController = require('../app/controllers/Admin/ClassesController');

router.post('/login', AuthController.loginAdmin);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

router.use(authenticateToken);
router.post("/ads/upload-file", authorize(['Ads Management-Create']), AdsController.uploadFile);
router.post("/ads/store", authorize(['Ads Management-Create']), AdsController.storeAds);
router.post("/ads/update", authorize(['Ads Management-Edit']), AdsController.updateAds);
router.post("/ads/view", authorize(['Ads Management-View']), AdsController.viewAds);
router.post("/ads/delete", authorize(['Ads Management-Delete']), AdsController.deleteAds);
router.post("/ads/list", authorize(['Ads Management-List']), AdsController.adsList);

router.post("/class/upload-file", authorize(['Class Management-Create']), ClassController.uploadFile);
router.post("/class/store", authorize(['Class Management-Create']), ClassController.storeClass);
router.post("/class/update", authorize(['Class Management-Edit']), ClassController.updateClass);
router.post("/class/view", authorize(['Class Management-View']), ClassController.viewClass);
router.post("/class/delete", authorize(['Class Management-Delete']), ClassController.deleteClass);
router.post("/class/list", authorize(['Class Management-List']), ClassController.classList);

module.exports = router;