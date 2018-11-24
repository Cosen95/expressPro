var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', username: req.session.username });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: '注册页' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '登录页'})
});

router.get('/logout', function(req,res,next) {
  // req.session.username = undefined;
  // res.redirect('/');
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  })
});

router.get('/comment', function(req,res,next) {
  res.render('comment', { title: '评论页' })
})

module.exports = router;
