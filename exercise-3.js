var mysql = require('mysql');
var colors = require('colors');
var Table = require('cli-table');

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.query("SELECT Account.id, Account.email, AddressBook.name FROM Account JOIN AddressBook on Account.id = AddressBook.accountId", function(err, rows, fields) {
  if (err) throw err;
  
  var results = rows.reduce(function(acc, row) {
    var found = acc.find( function(obj) {
      return obj.id === row.id;
    });
    
    if (found) {
      found.names += '\n' + row.name;
    }
    else {
      var data = {
        id: row.id,
        email: row.email,
        names: row.name
      };
      
      acc.push(data);
    }
    
    return acc;
  }, []);

  var table = new Table();
  
  results.forEach( function(obj) {
    var tableRow = {};
    
    tableRow[colors.red('#' + obj.id).bold] = obj.email.bold + '\n' + obj.names;
    table.push(tableRow);
  });
  
  console.log(table.toString());
  
  connection.end();
});
