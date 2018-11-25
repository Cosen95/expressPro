var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var DB_CONNECT_STR = "mongodb://localhost:27017/users";
var router = express.Router();

/* GET home page. */
router.post('/save', function(req, res, next) {
  // res.send('发布成功');
  console.log('评论信息',req.body);
  var title = req.body.comment_title;
  var content = req.body.comment_content;
  var insertData = function(db,callback) {
    // 关联集合
    var data = [{ title:title,content:content }];
    var conn = db.collection('comments');
    conn.insert(data,function(err,result) {
      if (err) {
        console.log(err);
      } else {
        callback(result);
      }
    })
  } 


  MongoClient.connect(DB_CONNECT_STR,function(err,db) {
    if (err) {
      console.log('连接数据库失败');
    } else {
      console.log('连接数据库成功');
      insertData(db,function(result) {
        res.send('嘻嘻嘻，你发布成功了呦~~~');
        db.close();
      })
    }
  })
});

module.exports = router;
