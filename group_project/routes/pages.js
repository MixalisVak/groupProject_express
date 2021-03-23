var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});
  

// Enter to login page
router.get('/login', (req, res) => {
  res.render('login', {message: ''});
});

// Enter to signup page
router.get('/signup',(req, res) => {
    res.render('signup', {message: ''});
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
