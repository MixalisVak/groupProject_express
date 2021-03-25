var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')

/* GET home page. */
router.get('/', (req, res) => {
    var fullUrl = req.protocol + '://' + req.get('host');
    console.log('fullUrl', fullUrl)
    res.render('index', { Url: fullUrl });
});
  

// Enter to login page
router.get('/login', (req, res) => {
    console.log(req.cookies.jwt)
    if(req.cookies.jwt){
        res.redirect('/')
    }else{
        res.render('login', {message: ''});
    }
    
});

// Enter to signup page
router.get('/signup',(req, res) => {
    if(req.cookies.jwt){
        res.redirect('/')
    }else{
        res.render('signup', {message: ''});
    }
    
});

router.get('/profile', authController.isLoggedIn, (req, res) => {
    if( req.user){
        res.render('profile', {
            user: req.user
        });

    }else{
        res.redirect('/login');
    }
    
});


module.exports = router;
