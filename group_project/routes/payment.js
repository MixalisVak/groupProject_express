var express = require('express');
var router = express.Router();
const authController = require('../controllers/auth')
const paypal = require('paypal-rest-sdk');
var dbconnection = require('../lib/db');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRET
});


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

// Credit card payment
router.post('/pay', authController.donation)


// Paypal payment
router.get('/paypal', (req, res) => res.render('paypal'));

// Paypal payment
router.post('/paypal', (req, res) => {
    
    const { first_name,
        emailAddress,
        amountDonation,
    } = req.body

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:3000/payment/success/?amount=${amountDonation}&emailAddress=${emailAddress}`,
            "cancel_url": "http://localhost:3000/payment/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Red Sox Hat",
                    "sku": "001",
                    "price": amountDonation,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amountDonation
            },
            "description": "Hat for the best team ever"
        }]
    }
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
               
                res.redirect(payment.links[i].href)
              }
            }
        }
      });
})

// If the transaction from the payment is succesful you will be redirected here.
// User's credentials with donation and id will be take place here.
router.get('/success', (req, res) => {
    
    
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const donation = req.query.amount;
    const emailAddress = req.query.emailAddress

    dbconnection.query('SELECT * FROM user WHERE emailAddress = ?', [emailAddress], async (err, results) => {
        let user_id = results[0].user_id;
        const query = `INSERT INTO donation(amount, user_id, charity_id) VALUES( ${donation},'${user_id}','${5}')`;

        dbconnection.query(query,  (err, results) => {

        if (err){
            console.log(err)
        } else{
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": donation
                    }
                }]
              };
              paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
                if (error) {
                    console.log(error.response);
                    throw error;
                } else {
                    console.log(JSON.stringify(payment));
                    res.redirect('/');
                }
            });
        }
        })
    })
  
    
  });

// Paypal payment
router.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = router