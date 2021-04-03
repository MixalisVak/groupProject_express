var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')

/* GET home page. */
router.get('/', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host');
    
    res.render('index', { Url: fullUrl, message: '' });
});
  

// Router to see the login page. 
router.get('/login', (req, res) => {
    console.log(req.cookies.jwt)
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
            res.redirect('/login');
        }
    }else{
        res.render('index', {message: "Only admins have access to this page.", Url: ''})
    }
    
});


// Exporting the router.
module.exports = router;
