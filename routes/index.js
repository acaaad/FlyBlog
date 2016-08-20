var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 3,
  host: 'localhost',
  user: 'root',
  database: 'blogdb',
  password: 'arshad'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/show', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    var sql = "SELECT * from user";
    connection.query(sql, function(err, row){
      if(err) console.error("err: "+err);
      console.log("row: "+JSON.stringify(row));
      res.json(row);
      connection.release();
    })
  })
})


router.post('/validate', function(req, res, next) {
  pool.getConnection(function(err, connection){
    //if(err) throw err;
    console.log(req);
    var name = req.body.name;
    var password = req.body.password;

    console.log(name,password);

    var sqlForSelectList = "SELECT * FROM user where name=\""+name+"\" and password=\""+password+"\"";
    //var sqlForSelectList = "SELECT * FROM test1 where id=\"wise\" and password=\"lab\"";
    //var sqlAdd = "INSERT into test values(5,\"Hwajangnim\")";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err: "+err);
      console.log("rows: "+ JSON.stringify(rows));
      res.json(rows);
      connection.release();
    })
  })
})

router.get('/showall/:userId', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    var sql = "SELECT * from blogpost where user_id=\""+req.params.userId+"\"";
    connection.query(sql, function(err, row){
      if(err) console.error("err: "+err);
      console.log("row: "+JSON.stringify(row));
      res.json(row);
      connection.release();
    })
  })
})

router.post('/addpost', function(req, res, next) {
  pool.getConnection(function(err, connection){
    //if(err) throw err;
    var user_id = req.body.user_id;
    var content = req.body.content;

    //console.log(user_id,content);
    var d = new Date();
    var fulldate = ""+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();

    var sqlForSelectList = "insert into blogpost (post, date, user_id) values (\""+content+"\", \""+fulldate+"\","+user_id+")";

    connection.query(sqlForSelectList, function(err, rows){
      if(err){
        console.log(err.code);
        if(err.code == "ER_NO_REFERENCED_ROW_2" || err.code == "ER_NO_REFERENCED_ROW") {
          res.status(500).send("No user assigned with that id!");
        }
      }
      else{
        console.log("rows: "+ JSON.stringify(rows));
        res.status(200).send("post added!");
      }
      connection.release();
    })
  })
})

router.get('/showpost/:idPost', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    var sql = "SELECT * from blogpost where id=\""+req.params.idPost+"\"";
    connection.query(sql, function(err, row){
      if(err) console.error("err: "+err);
      if(row.length==0){
        res.status(500).send("no post with that id");
      }
      else{
        console.log("row: "+JSON.stringify(row));
        res.json(row);
      }
      connection.release();
    })
  })
})

router.get('/delete/:idPost', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    var sql = "delete from blogpost where id=\""+req.params.idPost+"\"";
    connection.query(sql, function(err, row){
      if(err) console.error("err: "+err);
      // if(row.length==0){
      //   res.status(500).send("no post with that id");
      // }
      // else{
      //   console.log("row: "+JSON.stringify(row));
      //   res.json(row);
      // }
      res.send(row);
      connection.release();
    })
  })
})




module.exports = router;
