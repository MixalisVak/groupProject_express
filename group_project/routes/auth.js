var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');

router.post('/signup', authController.register)

router.post('/login', authController.login)

router.get('/logout', authController.logout)

module.exports = router;