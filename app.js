var express = require('express');
var mysql      = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'h415263789',
  database : 'sport_team'
});
var app = express();

var swig = require('swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

var  jsonToTable = require('json-to-table');

app.use(bodyParser.urlencoded({ extended: true })); 
 
function selectTable(req, res) {
	connection.query('SHOW tables;', function(err, result ){ 
	    tabled = jsonToTable(result);
		res.render('selectTable', {
			data_table: result
		});
	});
}
 
function getdata(req, res) {
  table = req.body.table;
  connection.query('SELECT * from '+table+' limit 100;', function(err, result) {
  if (err) throw err;
		var tabled = jsonToTable(result);
		res.render('index', {
			header: tabled[0],
			data: tabled
		});
		
  });
}

function updateData(req, res) {
	set = req.body.set;
	val_set = req.body.val_set;
	where = req.body.where;
	val_where = req.body.val_where;
	connection.query('UPDATE team SET '+set+' = '+val_set+' Where '+where+' = '+val_where+';', function(err, result) {
		if (err) throw err;
			res.redirect('/data');
	});
	
}
app.get('/table', selectTable);
app.post('/data', getdata);
app.post('/page3', updateData);
 
// start server ด้วย port 5555
var server = app.listen(3000, function() {
    console.log('Express.js is running...');
});