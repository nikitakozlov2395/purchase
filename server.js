const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(__dirname + '/public'));

app.post('/api/products/add', jsonParser, (req, res) => {
	if (!req.body) return res.sendStatus(400);
  	console.log(req.body); 
	const { name } = req.body
	const arrPush = [{ name }]
	dbWorkerPush(arrPush)
	res.sendStatus(200)
});

app.get('/api/products', (req, res) => {

 	db.all('SELECT DISTINCT id, name FROM purchases', (err, rows) => {
        rows.forEach((row) => {
            console.log(row.id, row.name);
        })

        res.send(rows)
	});
});

app.delete('/api/products/:id', function (req, res) {
	const id = req.params.id;
	console.log(id)
	db.run("DELETE FROM purchases WHERE id=(?)", id, function(err) {
	  	if (err) {
	    	return console.error(err.message);
	  	}
	  	console.log(`Row(s) deleted ${this.changes}`);
	});
  	res.send()
});

app.listen(3000, () => console.log('Server is open'));

//db.run('CREATE TABLE purchases ( id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)')

const dbWorkerPush = (arr) => {

	db.serialize(function() {

	  	const stmt = db.prepare('INSERT INTO purchases(name) VALUES (?)');

		arr.forEach(item => { stmt.run(item.name) });

	  	db.each('SELECT * FROM purchases', function(err, row) {
	    	console.log(row.id + ': ' + row.name);
	  	});
	});
} 