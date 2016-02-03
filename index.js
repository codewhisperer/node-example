var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

app.set('views', __dirname + '/');
app.engine('.html', require('jade').__express);

db.serialize(function() {
  db.run('CREATE TABLE cars (brand TEXT)');
  var stmt = db.prepare('INSERT INTO cars VALUES (?)');

	stmt.run('Tesla');
	stmt.run('Chevrolet');
	stmt.run('BMW');
	stmt.run('Nissan');

  stmt.finalize();

  db.each('SELECT rowid AS id, brand FROM cars', function(err, row) {
    console.log(row.id + ': ' + row.brand);
  });
});


app.get('/', function(req, res) {
	res.send('Test App');
});

app.get('/cars', function(req, res, next) {
	db.all('SELECT * FROM cars ORDER BY brand', function(err, row) {
    if(err !== null) {
      // Express handles errors via its next function.
      // It will call the next operation layer (middleware),
      // which is by default one that handles errors.
      next(err);
    }
    else {
      console.log(row);
      res.render('index.jade', {cars: row}, function(err, html) {
        res.send(200, html);
      });
    }
  });

});


app.listen(3000, function() {
	console.log("app is started up");
});


// db.close();
