var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 3,
  host: 'localhost:3306',
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
    var sql = "SELECT * from user";
    console.log("AWDAWD");
    connection.query(sql, function(err, row){
      if(err) console.error("err: "+err);
      console.log("row: "+JSON.stringify(row));
      res.json(row);
      connection.release();
    })
  })
})


module.exports = router;
