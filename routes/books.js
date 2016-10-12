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


module.exports = router;
