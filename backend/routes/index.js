let express = require('express');
let router = express.Router();
let Users = require('./users.js');
let Reminders = require('./reminders.js');
let Permissions = require('./permissions');
let Settings = require('./settings');
let Notes = require('./notes');
let Files = require('./files');

router.get('/main', function(req, res, next) {
    res.status(200).send("gg");
});


router.use('/users', Users);
router.use('/reminders', Reminders);
router.use('/permissions', Permissions);
router.use('/settings', Settings);
router.use('/notes', Notes);
router.use('/files', Files);

module.exports = router;
