var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var DB_CONNECT_STR = "mongodb://localhost:27017/users"

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',function(req,res){
  // res.send('注册成功');
  console.log('注册信息',req.body);
  var username = req.body.reg_name;
  var nickname = req.body.reg_nickname;
  var pwd = req.body.reg_pwd;
  var insertData = function(db,callback) {
    // 关联集合
    var data = [{ username:username,nickname:nickname,pwd:pwd }]
    var conn = db.collection('front');
    conn.insert(data,function(err,result) {
      if (err) {
        console.log(err)
      } else {
        callback(result);
      }
    })
  }
  // 连接数据库
  MongoClient.connect(DB_CONNECT_STR,function(err,db) {
    if (err) {
      console.log('连接数据库失败');
    } else {
      console.log('连接数据库成功');
      insertData(db,function(result) {
        res.send('哈哈，你已经注册成功了呦~~~')
        db.close();
      })
    }
  })
})

router.post('/login', function(req,res,next) {
  var username = req.body.log_name;
  var nickname = req.body.log_nickname;
  var pwd = req.body.log_pwd;

  var findData = function(db,callback) {
    // 查询条件
    var data = { username:username,nickname:nickname,pwd:pwd }
    // 关联集合
    var conn = db.collection('front');
    conn.find(data).toArray(function(err,result) {
      if (err) {
        console.log(err);
      } else {
        callback(result);
      }
    })
  }
  // 连接数据库
  MongoClient.connect(DB_CONNECT_STR,function(err,db) {
    if (err) {
      console.log('连接数据库失败');
    } else {
      findData(db,function(result) {
        console.log('登陆数据~~',result);
        if (result.length > 0) {
          res.redirect('/');
        } else {
          res.send('登陆失败');
        }
        db.close();
      })
    }
  })
})

module.exports = router;
