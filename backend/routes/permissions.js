const router = require('express').Router();
const permissionsController = require('../controllers/permissionsController');

router.get('/get/granted', permissionsController.getPermissionsGranted);
router.get('/get/received', permissionsController.getPermissionsReceived);
router.post('/create', permissionsController.createPermissions);

router.get('/searchEmail/:content', permissionsController.searchEmail);

module.exports = router;
