const express = require('express');
const router = express.Router();

const AdsController = require('../app/controllers/Admin/AdsController');

router.post("/ads/store", AdsController.storeAds);
router.post("/ads/update", AdsController.updateAds);
router.post("/ads/view", AdsController.viewAds);
router.post("/ads/delete", AdsController.deleteAds);
router.post("/ads/list", AdsController.adsList);

module.exports = router;