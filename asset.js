



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
    
     res.send(results);
    });
  })