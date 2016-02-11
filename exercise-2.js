var mysql = require('mysql');
var colors = require('colors');

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.query("SELECT id, email FROM Account limit 5", function(err, rows, fields) {
  if (err) throw err;
  
  rows.forEach(function(row) {
    console.log(colors.bold('#' + row.id + ":"), row.email);
  });

  connection.end();
});
