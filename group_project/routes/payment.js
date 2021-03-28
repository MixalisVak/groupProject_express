var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')
var dbconnection = require('../lib/db');


/* GET home page. */
router.get('/', authController.isLoggedIn, (req, res) => {
    if( req.user){
        res.render('payment', {
            user: req.user
        });

    }else{
        res.redirect('/login');
    }
   
});

router.post('/pay', authController.donation)


module.exports = router