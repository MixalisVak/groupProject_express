var express = require('express');
var router = express.Router();
var dbconnection = require('../lib/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  const query = "SELECT * FROM charity";
    
    dbconnection.query(query, function(err, rows) {
        if(err) {
            res.render('index', { title: 'User - ERROR' });
        } else {
            console.log('rows', rows)
            res.render('index', { title: 'User' });
        }
    });
  
});

module.exports = router;
