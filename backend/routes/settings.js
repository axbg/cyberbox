const router = require('express').Router();
const settingsController = require('../controllers/settingsController');

router.get('/get', settingsController.getSettings);
router.post('/push', settingsController.updateSettingsPush);
router.post('/mail', settingsController.updateSettingsMail);

module.exports = router;
