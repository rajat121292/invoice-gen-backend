var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
const EventEmitter = require('events');


const d = require('domain').create();

var insertId;
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
    database : 'invoicemgmt',
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

         var rows = results.length > 0 ? results[0] : null;
          console.log("results from mysql : " + results);
          res.send(JSON.stringify(rows));
      });
   })
  
   app.get('/user/email/:email/password/:password', function (req, res) {
     console.log(req.params);
       var param = req.params;
       var email = param.email;
       var password = param.password;

      connection.query('select * from user where email=? and password=?', [email, password], function (error, results, fields) {
         if (error) throw error;

         var rows = results.length > 0 ? results[0] : null;
          console.log("results from mysql : " + results);
          res.send(JSON.stringify(rows));
       });
   });

   app.get('/asset', function(req, res) {
     console.log("params in the request: " + req.params);

     connection.query('select * from asset',function(error, results) {
        if(error) {
          res.send(JSON.stringify(error));
          throw error;
        }

        res.send(results);
     });
   })

   app.post('/asset', function (req, res) {
     console.log("body in the request for /asset is : " + req.body);
     var reqBody = req.body;

     var assetName = reqBody.assetName;
     var description = reqBody.description;
     var address = reqBody.address;
     var ownerId = reqBody.ownerId;

     queryParams = {
       name: assetName,
       description: description,
       address: address,
       owner_id: ownerId
     }

     connection.query('insert into asset set ?', queryParams, function(error, results) {
        if (error) {  
          res.send(JSON.stringify(error));
          throw error;
        }
     });

     connection.query('SELECT * FROM asset where owner_id = ? and name = ? and description = ? and address = ?'
     , [queryParams.owner_id, queryParams.name, queryParams.description, queryParams.address], function (error, results, fields) {
      if (error) {
          throw error;
      }
     
      var rows = results.length > 0 ? results[0] : null;
          console.log("results from mysql : " + results);
          res.send(JSON.stringify(rows));
     });
   })



   ///it is incomplete, Please complete it
   app.post('/asset/update', function (req, res) {
    console.log("body in the request for /asset/update is : " + JSON.stringify(req.body));
    var reqBody = req.body;

    var assetId = reqBody.assetId;
    var assetName = reqBody.assetName;
    var description = reqBody.description;
    var address = reqBody.address;
    var ownerId = reqBody.ownerId;

    queryParams = {
      id: assetId,
      name: assetName,
      description: description,
      address: address,
      owner_id: ownerId
    }

    if(!queryParams.id) {
      res.send(new Error("id cannot be null while updating the asset"));
      return;
    }

    connection.query('update  asset set name = ? and description = ? and address = ? and owner_id = ? where id = ?',
     [queryParams.name, queryParams.description, queryParams.address, queryParams.owner_id, queryParams.id], function(error, results) {
       if (error) {  
         res.send(JSON.stringify(error));
         return;
       }
    });

    connection.query('SELECT * FROM asset where id = ?'
    , [queryParams.id], function (error, results, fields) {
     if (error) {
      res.send(JSON.stringify(error));
      return;
     }
    
     var rows = results.length > 0 ? results[0] : null;
         console.log("results from mysql : " + results);
         res.send(JSON.stringify(rows));
    });
  })



   app.post('/contract', function(req, res) {
    console.log("body in the request for /contract is : " + req.body);
    var reqBody = req.body;

    var assetId = reqBody.assetId;
    var lesseId = reqBody.lesseId;
    var lessorId = reqBody.lessorId;
    var amountPerCycle = reqBody.amountPerCycle;
    var billCycle = reqBody.billCycle;

    queryParams = {
      asset_id: assetId,
      lesse_id: lesseId,
      lessor_id: lessorId,
      amount_per_cycle: amountPerCycle,
      bill_cycle: billCycle
    }

    connection.query('insert into contract set ?', queryParams, function(error, results) {
       if (error) {  
         res.send(JSON.stringify(error));
         throw error;
       }
    });

    connection.query('SELECT * FROM contract where asset_id = ?  and lesse_id = ? and lessor_id = ? and amount_per_cycle = ? and bill_cycle = ?'
    , [queryParams.asset_id, queryParams.lesse_id, queryParams.lessor_id, queryParams.amount_per_cycle, queryParams.bill_cycle], 
    function (error, results, fields) {
     if (error) {
      res.send(JSON.stringify(error));
         throw error;
     }
    
     var rows = results.length > 0 ? results[0] : null;
         console.log("results from mysql : " + results);
         res.send(JSON.stringify(rows));
    });
   })


   app.get('/contract/:userId', function(req, res) {
    console.log("params in the request: " + JSON.stringify(req.params));

    connection.query('select * from contract where lessor_id=? or lesse_id = ?',[req.params.userId, req.params.userId],
    function(error, results) {
       if(error) {
         res.send(JSON.stringify(error));
         throw error;
       }

       res.send(results);
    });
  })
  
  
});

