var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 3,
  host: 'localhost',
  user: 'root',
  database: 'blogdb',
  password: '12345'
});
var path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next){
  if(!req.session.user){
    //res.sendFile(path.join(__dirname+'/../public/login.html'));
    res.redirect('login');
  }
  else{
    res.sendFile(path.join(__dirname+'/../public/home.html'));
  }
});

router.get('/logout', function(req, res, next){
    req.session.destroy();
    res.redirect('login');
});

router.get('/login', function(req, res, next){
  res.sendFile(path.join(__dirname+'/../public/login.html'));
});

router.get('/post', function(req, res, next){
  res.sendFile(path.join(__dirname+'/../public/edit.html'));
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
});


router.post('/validate', function(req, res, next) {
  pool.getConnection(function(err, connection){
    //if(err) throw err;
    console.log(req);
    var name = req.body.name;
    var password = req.body.password;

    console.log(name,password);

    var sqlForSelectList = "SELECT * FROM user where name=\""+name+"\" and password=\""+password+"\"";
    console.log(sqlForSelectList);
    //var sqlForSelectList = "SELECT * FROM test1 where id=\"wise\" and password=\"lab\"";
    //var sqlAdd = "INSERT into test values(5,\"Hwajangnim\")";
    connection.query(sqlForSelectList, function(err, rows){
      if(err) console.error("err: "+err);
      console.log("rows: "+ JSON.stringify(rows));
    if(rows.length!=0){
       // var context = JSON.stringify(row);
       // var jeson = JSON.parse(context);
        req.session.user = name;
        //freq.session.id = jeson[0]["id"];
        console.log("BIASA AJA "+ rows.json);
      }
      res.json(rows);
      connection.release();
    })
  })
});

router.get('/showall/:userId', function(req, res, next){
  pool.getConnection(function(err, connection) {
    if(err) throw err;
    var sql = "SELECT * from blogpost where user_id="+req.params.userId+" ORDER BY id DESC";
    console.log(sql);
    connection.query(sql, function(err, row){
      if(err) console.error("err: "+err);
      console.log("row: "+JSON.stringify(row));
      res.json(row);
      connection.release();
    })
  })
});

router.post('/addpost', function(req, res, next) {
  pool.getConnection(function(err, connection){
    //if(err) throw err;
    console.log("addpost");
    var user_id = req.body.user_id;
    var content = req.body.content;
    var title = req.body.title;

    //console.log(user_id,content);
    var d = new Date();
    var fulldate = ""+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();
    var sqlForSelectList = "insert into blogpost (post, date, user_id, title) values (\""+content+"\", \""+fulldate+"\", "+user_id+",\""+title+"\")";
    console.log(sqlForSelectList);

    connection.query(sqlForSelectList, function(err, rows){
      if(err){
        console.log(err);
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
});

router.get('/showpost/:idPost', function(req, res, next){
  if(!req.session.user){
    //res.sendFile(path.join(__dirname+'/../public/login.html'));
    res.redirect('../login');
  }
  else{
    pool.getConnection(function(err, connection) {
      if(err) throw err;
      var sql = "SELECT * from blogpost where id=\""+req.params.idPost+"\"";
      connection.query(sql, function(err, row){
        if(err) console.error("err: "+err);
        if(row.length==0){
          res.status(500).send("no post with that id");
        }
        else{
          //console.log("row: "+JSON.stringify(row));
          var context = JSON.stringify(row);
          var jeson = JSON.parse(context);
          res.render('blog', {post: jeson});
        }

        connection.release();
      })
    })
  }

});

router.get('/showcomment/:idPost', function(req, res, next){
    if(!req.session.user){
        //res.sendFile(path.join(__dirname+'/../public/login.html'));
        res.redirect('../login');
    }
    else{
        pool.getConnection(function(err, connection) {
            if(err) throw err;
            var sql = "SELECT * from comment where post_id=\""+req.params.idPost+"\" order by id desc";
            connection.query(sql, function(err, row){
                if(err) console.error("err: "+err);
                if(row.length==0){
                    res.status(500).send("no post with that id");
                }
                else{
                    //console.log("row: "+JSON.stringify(row));
                    var context = JSON.stringify(row);
                    console.log(context);
                    res.json(row);
                }

                connection.release();
            })
        })
    }

});

router.post('/addcomment', function(req, res, next) {

  pool.getConnection(function(err, connection){
    //if(err) throw err;
    var post_id = req.body.postid;
    var content = req.body.content;
    console.log(req.body);
    var sqlForSelectList = "insert into comment (comment, post_id) values (\""+content+"\", "+post_id+")";
    console.log(sqlForSelectList);

    connection.query(sqlForSelectList, function(err, rows){
      if(err){
        console.log(err);
        if(err.code == "ER_NO_REFERENCED_ROW_2" || err.code == "ER_NO_REFERENCED_ROW") {
          res.status(500).send("No user assigned with that id!");
        }
      }
      else{
        console.log("rows: "+ JSON.stringify(rows));
        res.status(200).send("comment added!");
      }
      
      connection.release();
    })
  })
});

router.get('/dashboard', function(req, res){
  if(!req.session.user){
    return res.status(401).send();
  }
  else{
    return res.status(200).send("Berhasil masuk!");
  }
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
      //res.send(row);
      res.redirect('../home');
      connection.release();
    })
  })
});

router.post('/update', function(req, res, next) {
  pool.getConnection(function(err, connection){
    //if(err) throw err;
    var post_id = req.body.post_id;
    var content = req.body.content;

    //console.log(user_id,content);
    var d = new Date();
    var fulldate = ""+d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();

    var sqlForSelectList = "update blogpost set post=\""+content+"\" where id="+post_id;

    connection.query(sqlForSelectList, function(err, rows){
      if(err){
        console.log(err);
        if(err.code == "ER_NO_REFERENCED_ROW_2" || err.code == "ER_NO_REFERENCED_ROW") {
          res.status(500).send("No user assigned with that id!");
        }
      }
      else{
        console.log("rows: "+ JSON.stringify(rows));
        res.status(200).send("post updated!");
      }
      connection.release();
    })
  })
})



module.exports = router;
