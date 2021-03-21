var express = require('express');
var router = express.Router();
var dbconnection = require('../../lib/db');
const bcrypt = require('bcrypt')

// Enter to login page
router.get('/login', function(req, res, next) {
    
  res.render('login');
});

// Enter to signup page
router.get('/signup', function(req, res, next) {

    res.render('signup');
});


router.post('/signup', async function(req, res, next) {
    console.log('here1')
    if (req.body.password == req.body.confirm_pass){
        console.log('here2')
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const first_name = req.body.first_name;
        const last_name = req.body.last_name;
        const emailAddress = req.body.emailAddress;
        const country = req.body.country;
        const phoneNumber = req.body.phone_number;

        const query = `INSERT INTO user(first_name, last_name, emailAddress, country, phone_number, password  ) VALUES(
            '${first_name}',
            '${last_name}',
            '${emailAddress}',
            '${country}',
            '${phoneNumber}',
            '${hashedPassword}',
        );`;
        
        dbconnection.query(query, function(err, rows) {
            if(err) {
                res.render('error', { title: 'User - ERROR' , error: err});
            } else {
                console.log('here3')
                res.redirect('/login');
            }
        });
        
    }else{
        res.redirect('/signup')
    }
    
      
});

module.exports = router;
