var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth');




router.get('/logout', authController.logout)

module.exports = router;