let express = require('express');
let router = express.Router();
let usersController = require('../public/controllers/usersController');
let middlewares = require('../public/controllers/middlewares');


router.get('/get', usersController.getUsers);
router.get('/get/:email', usersController.getOneUser);
router.delete('/delete', usersController.deleteUser);
router.get('/welcome', usersController.Welcome);

module.exports = router;
