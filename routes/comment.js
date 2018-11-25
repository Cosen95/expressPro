var express = require('express');
var async = require('async');
var MongoClient = require('mongodb').MongoClient;
var DB_CONNECT_STR = "mongodb://localhost:27017/users";
var router = express.Router();

/* GET home page. */
router.post('/save', function(req, res, next) {
  // res.send('发布成功');
  console.log('评论信息',req.body);
  var title = req.body.comment_title;
  var content = req.body.comment_content;
  // var insertData = function(db,callback) {
  //   // 关联集合
  //   var data = [{ title:title,content:content }];
  //   var conn = db.collection('comments');
  //   conn.insert(data,function(err,result) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       callback(result);
  //     }
  //   })
  // } 

  var updateData = function(db,callback) {
    var conn = db.collection('comments');
    var ids = db.collection('ids');
    async.waterfall([function(callback){
      ids.findAndModify({name:'comments'},[["_id","desc"]],{$inc:{id:1}},function(err,result){
        callback(null,result.value.id)
      })
    },function(id,callback){
      var data = [{uid:id,title:title,content:content,username:req.session.username}];
      conn.insert(data,function(result){
        callback(result)
      })
    }],function(err,result){
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
      // insertData(db,function(result) {
      //   res.send('嘻嘻嘻，你发布成功了呦~~~');
      //   db.close();
      // })
      updateData(db,function(result) {
        // res.send('嘻嘻嘻，你发布成功了呦~~~');
        res.redirect('/comment/list');
        db.close();
      })
    }
  })
});

router.get('/list',function(req,res) {
  var findData = function(db,callback) {
    var conn = db.collection('comments');
    conn.find({}).toArray(function(err,result) {
      if (err) {
        console.log(err);
      } else {
        callback(result);
      }
    })
  }
  MongoClient.connect(DB_CONNECT_STR,function(err,db){
    if (err) {
      console.log(err);
    } else {
      findData(db,function(result) {
        if (result.length > 0) {
          console.log('评论列表页信息',result);
          res.render('list',{ title:'列表页',list:result });
        } else {
          res.send('亲，没有评论信息~~');
        }
      })
    }
  })
})

router.get('/detail',function(req,res) {
  // res.send('列表页');
  var uid = parseInt(req.query.uid);
  MongoClient.connect(DB_CONNECT_STR,function(err,db) {
    var conn = db.collection('comments');
    conn.find({uid:uid}).toArray(function(err,result) {
      if (err) {
        console.log(err);
      } else {
        console.log('详情页信息',result);
        res.render('detail',{ title:'详情页',mes:result });
      }
    })
  })
})

module.exports = router;
