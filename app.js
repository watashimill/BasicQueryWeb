var express = require('express');
var mysql      = require('mysql');
var path = require('path');
var bodyParser = require('body-parser');
var connection ;
var app = express();

var swig = require('swig');
app.engine('html', swig.renderFile);
app.set('view engine', 'html');

var  jsonToTable = require('json-to-table');

app.use(bodyParser.urlencoded({ extended: true })); 
 
var nametable;
var head;
var name_database = ['mill','parkinglot','kim','parking'];


function selectDatabase(req, res) {
		res.render('selectDatabase', {
			database: name_database
		});
}

function connectdb(req, res) {
	namedb = req.query['namedb'];
	connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'Watashimill1',
		database : namedb
	});
	selectTable(req, res);
}

function selectTable(req, res) {
	connection.query('SHOW tables;', function(err, result ){
		res.render('selectTable', {
			database : name_database,
			data_table: result
		});
	});
}
 


function saveTable(req, res) {
	nametable = req.query['table'];
	getdata(req, res);
}
 
function getdata(req, res) {
  connection.query('SELECT * from '+nametable+' limit 100;', function(err, result) {
  if (err) throw err;
		tabled = jsonToTable(result);
		head = tabled[0];
		res.render('index', {
			header: tabled[0],
			data: tabled
		});	
  });
}
function insertData(req, res) {
	var range = head.length;
	var columns = '';
	for (var i = 0; i < range; i++) { 
	    if(i == 0){
			columns += ('"'+req.query[head[i]]+'"');
		}else{
			columns += (','+'"'+req.query[head[i]]+'"');
		}
	}
	console.log(columns);
	connection.query('INSERT INTO '+nametable+' VALUES('+columns+');', function(err, result) {
		if (err) throw err;
			res.redirect('/data');
	});
	
}
function updateData(req, res) {
	set = req.query['set'];
	val_set = req.query['val_set'];
	where = req.query['where'];
	val_where = req.query['val_where'];
	connection.query('UPDATE '+nametable+' SET '+set+' = '+'"'+val_set+'"'+' Where '+where+' = '+'"'+val_where+'"'+';', function(err, result) {
		if (err) throw err;
			res.redirect('/data');
	});
	
}

function deleteData(req, res) {
	where = req.query['where'];
	val_where = req.query['val_where'];
	connection.query('DELETE FROM '+nametable+' Where '+where+' = '+'"'+val_where+'"'+';', function(err, result) {
		if (err) throw err;
			res.redirect('/data');
	});
	
}

app.get('/', selectDatabase);
app.get('/connectdb', connectdb);
app.get('/table', selectTable);
app.get('/savetable', saveTable);
app.get('/data', getdata);
app.get('/update', updateData);
app.get('/insert', insertData);
app.get('/delete', deleteData);
 
// start server ด้วย port 5555
var server = app.listen(3000, function() {
    console.log('Express.js is running...');
});
