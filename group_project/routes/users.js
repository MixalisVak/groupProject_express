var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  const query = "SELECT * FROM user";
    
    dbconnection.query(query, function(err, rows) {
        if(err) {
            res.render('index', { title: 'User - ERROR' });
        } else {
            res.render('index', { title: 'User' });
        }
    });
});

module.exports = router;
