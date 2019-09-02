
var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'iamreputed',
  database : 'invoicemgmt',
});
 
 
connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));



var server = app.listen(3000, "127.0.0.1", function () {
 
    var host = server.address().address
    var port = server.address().port
   
    console.log("Example app listening at http://%s:%s", host, port)
   
  });

 app.post('/user', function(req, res) {

     var params = req.body;
     console.log(params);
     let queryResult;
     connection.query('INSERT INTO user SET ?', params, function (error, results, fields) {
         if (error) {
             res.end(JSON.stringify(error));
        }
        
         queryResult = results;
     });

     connection.query('SELECT * FROM user where id_proof_number = ?', params.id_proof_number, function (error, results, fields) {
        if (error) {
            res.end(JSON.stringify(error));
       }
       
        res.send(results[0]);
    });
 })

 app.post('/asset', function(req, res) {
     var params = req.body;
     console.log(params);
     connection.query('INSERT INTO asset SET ?', params, function(error, results, fields) {
         if (error) {
             res.end(JSON.stringify(error));
             throw error;
         }
         res.end(JSON.stringify(results));
     })
 })

 app.post(
     '/invoice', function(req, res) {
         var params = req.body;
         console.log(params);
         connection.query('INSERT INTO invoice SET ?', params, function(error, result, fields){
             if(error) {
                 res.end(JSON.stringify(error));
                 throw error;
             }
             res.end(JSON.stringify(result));
         })
     }
 )

 app.get('/user/:id', function (req, res) {
    connection.query('select * from user where id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 app.get('/asset/:id', function (req, res) {
    connection.query('select * from user where id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 app.get('/users', function (req, res) {
    connection.query('select * from user', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 app.get('/asset/user/:id', function (req, res) {
    connection.query('select * from asset where owner_id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 app.post(
    '/invoice/update', function(req, res) {
        var params = req.body;
        console.log(params);
        connection.query('UPDATE invoice SET ?', params, function(error, result, fields){
            if(error) {
                res.end(JSON.stringify(error));
                throw error;
            }
            res.end(JSON.stringify(result));
        })
    }
)

app.get('/invoice/user/owner/:id', function (req, res) {
    connection.query('select * from asset where owner_id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });

 app.get('/invoice/user/tenant/:id', function (req, res) {
    connection.query('select * from asset where tenant_id=?', [req.params.id], function (error, results, fields) {
       if (error) throw error;
       res.end(JSON.stringify(results));
     });
 });
