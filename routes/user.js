const express = require('express');
const router = express.Router();

const AdsController = require('../app/controllers/User/AdsController');

router.post("/ads/list", AdsController.adsList);

module.exports = router;