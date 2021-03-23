var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')

/* GET home page. */
router.get('/', (req, res) => {
  
    res.render('index', { title: 'Express' });
  });
  
  module.exports = router;
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





// router.post('/signup', async function(req, res, next) {
//     console.log('here1')
//     console.log('req.body', req.body)
//     if (req.body.password == req.body.confirm_pass){
//         console.log('here2')
//         const hashedPassword = await bcrypt.hash(req.body.password, 10)
//         const first_name = req.body.first_name;
//         const last_name = req.body.last_name;
//         const emailAddress = req.body.emailAddress;
//         const country = req.body.country;
//         const phoneNumber = req.body.phoneNumber;

        // const query = `INSERT INTO user(first_name, last_name, emailAddress, country, phone_number, password  ) VALUES(
        //     '${first_name}',
        //     '${last_name}',
        //     '${emailAddress}',
        //     '${country}',
        //     '${phoneNumber}',
        //     '${hashedPassword}'
        // )`;
//         console.log('query', query)
//         dbconnection.query(query, function(err, rows) {
//             if(err) {
//                 console.log('err', err)
//                 res.render('error', { title: 'User - ERROR' , error: err, message: 'error message'});
//             } else {
//                 console.log('here3')
//                 res.redirect('/entrance/login');
//             }
//         });
        
//     }else{
//         res.redirect('/signup')
//     }
    
      
// });

module.exports = router;
