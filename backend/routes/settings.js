var express = require('express');
var router = express.Router();
var settingsController = require('../public/controllers/settingsController');


router.get('/get', settingsController.getSettings);
router.post('/push', settingsController.updateSettingsPush);
router.post('/mail', settingsController.updateSettingsMail);
module.exports = router;
