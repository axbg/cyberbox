const router = require('express').Router();
const usersController = require('../controllers/usersController');

router.get('/get', usersController.getUsers);
router.get('/get/:email', usersController.getOneUser);
router.delete('/delete', usersController.deleteUser);
router.get('/welcome', usersController.Welcome);

module.exports = router;
