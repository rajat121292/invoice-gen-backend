var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
const EventEmitter = require('events');


const d = require('domain').create();
d.on('error', (er) => {
  // The error won't crash the process, but what it does is worse!
  // Though we've prevented abrupt process restarting, we are leaking
  // resources like crazy if this ever happens.
  // This is no better than process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});

d.run(() => {


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
  
  connection.on('error', (err) => {
      // If the connection is reset by the server, or if it can't
      // connect at all, or on any sort of error encountered by
      // the connection, the error will be sent here.
      console.log("HAHA");
    });
  
  
  
  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
  
  
  
  var server = app.listen(3000, "127.0.0.1", function () {
   
      var host = server.address().address
      var port = server.address().port
     
      console.log("Example app listening at http://%s:%s", host, port)
     
    });
  
//   process.on('uncaughtException', function (err) {
//       console.error(err);
//       console.log("Node NOT Exiting...");
//     });
  
   app.post('/user', function(req, res) {
  
       var params = req.body;
       console.log(params);
       let queryParams = {
           name: params.name,
           id_proof: params.idProof,
           id_proof_value: params.idProofValue,
           email: params.email,
           password: params.password
       };
  
       connection.query('INSERT INTO user SET ?', queryParams, function (error, results, fields) {
           if (error) {  
                res.send(JSON.stringify(error));
               throw error;
          }
           queryResult = results;
       });
       
       connection.query('SELECT * FROM user where email = ?', [params.email], function (error, results, fields) {
          if (error) {
              throw error;
         }
         
          res.send(results);
      });
   })
  
   app.get('/user/email/:email/password/:password', function (req, res) {
     console.log(req.params);
       var param = req.params;
       var email = param.email;
       var password = param.password;

      connection.query('select * from user where email=? and password=?', [email, password], function (error, results, fields) {
         if (error) throw error;
         res.end(JSON.stringify(results));
       });
   });
  
  
});

