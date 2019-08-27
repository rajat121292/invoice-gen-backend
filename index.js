var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'iamreputed',
  database : 'test',
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

//   app.get('/customer', function (req, res) {
//     connection.query('select * from customer', function (error, results, fields) {
//     if (error) throw error;
//     res.end(JSON.stringify(results));
//   });
//  });

//  //rest api to get a single customer data
// app.get('/customer/:id', function (req, res) {
//     connection.query('select * from customer where Id=?', [req.params.id], function (error, results, fields) {
//        if (error) throw error;
//        res.end(JSON.stringify(results));
//      });
//  });

//  //rest api to create a new customer record into mysql database
// app.post('/customer', function (req, res) {
//     var params  = req.body;
//     console.log(params);
//     connection.query('INSERT INTO customer SET ?', params, function (error, results, fields) {
//        if (error) throw error;
//        res.end(JSON.stringify(results));
//      });
//  });

//  //rest api to create a new customer record into mysql database
// app.post('/customer', function (req, res) {
//     var params  = req.body;
//     console.log(params);
//     connection.query('INSERT INTO customer SET ?', params, function (error, results, fields) {
//        if (error) throw error;
//        res.end(JSON.stringify(results));
//      });
//  });

 app.post('/user', function(req, res) {
     var params = req.body;
     console.log(params);
     connection.query('INSERT INTO user SET ?', params, function (error, results, fields) {
         if (error) {
             res.end(JSON.stringify(error));
        }
         res.end(JSON.stringify(results));
     })
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
