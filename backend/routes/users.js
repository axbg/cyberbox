const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.get('/welcome', usersController.Welcome);
router.get('/get', usersController.getUsers);
router.delete('/delete', usersController.deleteUser);

router.get('/get/:email', usersController.getOneUser);

module.exports = router;
