var router = require('express').Router();
var pg = require('pg');

var config = {
  database:'rho'
};

// initialize the database connection pool
var pool = new pg.Pool(config);


//this will allow a spicific look up by id
router.get('/:id',function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
    console.log('Error connectiong to DB', err);
    res.sendStatus(500);
    done();
    return;
    }
    client.query('SELECT * FROM books WHERE id = $1;', [req.perams.id], function(err, result) {
      done();
      if (err) {
      console.log('Error querrying to DB', err);
      res.sendStatus(500);
      return;
      }
      console.log('Got rows from the DB',result.rows);
      res.send(result.rows);
    });//end of query

  });// end of connection

});//end of get


router.get('/',function (req, res) {

  //err - an error object, will be not null if there was an error connecting
  //   possible errors, db not running, config is wrong
  //client - object that is used to make queries against the db
  //done - function to call when you're done(returns connection back to pool)
  pool.connect(function (err, client, done) {
    if (err) {
    console.log('Error connectiong to DB', err);
    res.sendStatus(500);
    done();
    return;
    }



    //1. SQL string
    //2. (optional) input perameters
    //3. callback function to execute once the querry finishes
    //      takes an error object and a result object as args
    client.query('SELECT * FROM books;', function(err, result) {
      done();
      if (err) {
      console.log('Error querrying to DB', err);
      res.sendStatus(500);
      return;
      }
      console.log('Got rows from the DB',result.rows);
      res.send(result.rows);
    });//end of query

  });// end of connection

});//end of get

router.post('/', function (req, res) {
  console.log(req.body);
  pool.connect(function (err,client,done) {
    if (err) {
      res.sendStatus(500);
      done();
      return;
    }
    client.query('INSERT INTO books (author, title, published, edition, publisher) VALUES ($1, $2, $3, $4, $5) returning *;',
                  [req.body.author, req.body.title, req.body.published, req.body.edition, req.body.publisher],
                  function (err, result) {
      done();
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
      }

      res.send(result.rows);
    });
  });//end of pool connection


});//end of post
//in future enter delete like put
router.delete('/', function (req, res) {
  console.log(req.body);
  pool.connect(function (err,client,done) {
    if (err) {
      res.sendStatus(500);
      done();
      return;
    }
    client.query('DELETE  FROM books WHERE id = $1;',
                  [req.body.id],
                  function (err, result) {
      done();
      if (err) {
        console.log(err);
        res.sendStatus(500);
        return;
        }

        res.send(result.rows);

      });
    });
  });
  //PUT localhost:3000/42
  // req.params.id === 42
  //modify existing row in the database
  router.put('/:id', function (req, res) {
    var id = req.params.id; //params represents any url paramiters
    var author = req.body.author;
    var title = req.body.title;
    var published = req.body.published;
    var edition = req.body.edition;
    var publisher = req.body.publisher;
    console.log('whats id', id);

    pool.connect(function (err,client,done) {
     try{//for error testing
      if (err) {
        res.sendStatus(500);
        return;
      }
    client.query('UPDATE books SET author = $1, title=$2, published=$3, edition=$4, publisher=$5 WHERE id=$6;',
                  [author, title, published, edition, publisher, id],
                      function (err, result) {
                         if (err) {
                           console.log('Error querying database', err);
                           res.sendStatus(500);
                         }

                      });//end of query
      }finally {//second half of try
        done();
      }
    });//end of conect
  });//end of put

module.exports = router;
