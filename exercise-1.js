var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.query("show databases", function(err, rows, fields) {
  if (err) throw err;

  rows.forEach(function(row, i) {
    console.log(i+1, row.Database);
  });
  
  connection.end();
});
