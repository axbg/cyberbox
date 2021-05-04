const router = require('express').Router();

const Users = require('./users.js');
const Reminders = require('./reminders.js');
const Permissions = require('./permissions');
const Settings = require('./settings');
const Notes = require('./notes');
const Files = require('./files');

router.get('/main', function (req, res, next) {
  res.status(200).send('gg');
});

router.use('/users', Users);
router.use('/reminders', Reminders);
router.use('/permissions', Permissions);
router.use('/settings', Settings);
router.use('/notes', Notes);
router.use('/files', Files);

module.exports = router;
