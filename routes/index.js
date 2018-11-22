var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: '注册页' });
});

module.exports = router;
