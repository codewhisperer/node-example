var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();

// instantiate an in-memory sqlite3 database
var db = new sqlite3.Database(':memory:');

// use jade as templating engine
app.set('views', __dirname + '/');
app.engine('.html', require('jade').__express);

// create test data(cars) in the database
db.serialize(function() {
	// create cars table
	db.run('CREATE TABLE cars (brand TEXT)');

	// insert rows
	var stmt = db.prepare('INSERT INTO cars VALUES (?)');
	stmt.run('Tesla');
	stmt.run('Chevrolet');
	stmt.run('BMW');
	stmt.run('Nissan');

  stmt.finalize();
});

// create a route for / -- show a list of cars
app.get('/', function(req, res, next) {
	db.all('SELECT * FROM cars ORDER BY brand', function(err, row) {
    if(err !== null) {
      // error handling
      next(err);
    }
    else {
			// load jade template with database content
      res.render('index.jade', {cars: row}, function(err, html) {
        res.status(200).send(html);
      });
    }
  });
});


app.listen(3000, function() {
	console.log("app is started up");
});
