var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')
var dbconnection = require('../lib/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailgun = require("mailgun-js");
const DOMAIN = process.env.DOMAIN;
const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});

/* GET home page. */
router.get('/', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host');
    
    res.render('index', { Url: fullUrl, message: '' });
});
  

// Router to see the login page. 
router.get('/login', (req, res) => {
    if(req.cookies.jwt){
        res.redirect('/')
    }else{
        res.render('login', {message: '', errors: ''});
    }
    
});

// Router when you login with your credentials. The form sends the password and
// the email address here and the authController takes control.
router.post('/login', authController.login)



// Router to see the sign up page. If you are already logged in you can not enter this page.
router.get('/signup',(req, res) => {
    if(req.cookies.jwt){
        res.redirect('/')
    }else{
        res.render('signup', {message: ''});
    }
    
});

// Router when you sign up with your credentials. The form sends the password and
// the email address here and the authController takes control.
router.post('/signup', authController.register)



// Profile page for testing.
router.get('/profile', authController.isLoggedIn, (req, res) => {
    
    // Check if user is logged in.
    if( req.user){
        //Check if user is admin.
        if (req.user.user_role === 'admin'){
            res.render('profile', {
                user: req.user
            });
        } else{
            res.render('index', {message: "Only admins have access to this page.", Url: ''})
        }
    }else{
        
        res.redirect('/login');
    }
    
});


router.get('/authentication/activate/:token', authController.activateAccount)


router.get('/forgot', (req, res) => {
    res.render('forgot');
});

router.post('/forgot',(req, res) => {

    let emailAddress = req.body.emailAddress

    dbconnection.query('SELECT user_id, emailAddress FROM user WHERE emailAddress = ?', [emailAddress], async (err, results) => {
        if (err) {
            console.log(err)
        }
        if (results.length === 0){
            
            res.send('Invalid Email')
        }
        const token = jwt.sign({ emailAddress: emailAddress}, process.env.RESET_PASSWORD_KEY, {expiresIn: '5m'});
        const data = {
            from: 'noreply@hello.com',
            to: process.env.EMAILTOSEND,
            subject: 'Reset Password Link',
            html: `
                <h2>Click here to Reset your password</h2>
                <p>${process.env.CLIENT_URL}/reset/${token}</p>
            `
        };
        mg.messages().send(data, function (error, body) {
            if (error){
                console.log(error)
            }
        });
        dbconnection.query(`UPDATE user SET passwordResetToken = '${token}' WHERE user_id = ${results[0].user_id}`,  (err, results) => {
        
            if (err){
                console.log(err)
            } 
            else{
                res.send('Your link to reset the password has been sent.')
            }
        });
    })
    
});

router.get('/reset/:token',   (req, res) => {
    res.render('reset')
})

router.post('/reset/:token', async(req, res) => {
    let token = req.params.token
    let password = req.body.password
    let confPass = req.body.confPass
    const decoded = (jwt.verify)(token, process.env.RESET_PASSWORD_KEY)
    let hashedPassword = await bcrypt.hash(password, 8);


    if (password !== confPass){
        return res.render('login', {message: 'Passwords do not match'})
    }else{
        dbconnection.query('SELECT user_id, emailAddress FROM user WHERE emailAddress = ?', [decoded.emailAddress], async (err, results) => {
            if (err) {
                console.log(err)
            }else{
                dbconnection.query(`UPDATE user SET password = '${hashedPassword}' WHERE user_id = ${results[0].user_id}`,  (err, results) => {
                    if (err){
                        console.log('eeeer', err)
                    } 
                    else{
                        return res.redirect('/login')
                    }
                });
            }
            
        });
    }
});



// Exporting the router.
module.exports = router;