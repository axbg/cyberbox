const router = require('express').Router();
const remindersController = require('../controllers/remindersController');

router.post('/create', remindersController.createReminder);
router.get('/getUndone', remindersController.getUndoneReminders);
router.get('/getDone', remindersController.getDoneReminders);
router.get('/getAll', remindersController.getAllReminders);
router.post('/makeDone', remindersController.makeDone);
router.post('/makeUndone', remindersController.makeUndone);

module.exports = router;
