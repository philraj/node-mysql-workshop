var mysql = require('mysql');
var colors = require('colors');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.query("SELECT * from Account", function(err, rows, fields) {
  if (err) throw err;
  
  rows.forEach(function(row) {
    console.log(row);
  });

  connection.end();
});
