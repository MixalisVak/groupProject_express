var express = require('express');
var router = express.Router();
var dbconnection = require('../lib/db');
const authController = require('../controllers/auth');

router.post('/signup', authController.register)

router.post('/login', authController.login)

module.exports = router;