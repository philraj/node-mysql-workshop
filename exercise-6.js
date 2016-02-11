var mysql = require('mysql');
var colors = require('colors');
var Table = require('cli-table');
var util = require("util");

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

var query = "SELECT Account.id as aID, Account.email, AddressBook.id as abID, \
                    AddressBook.accountId, AddressBook.name, Entry.id as eID, \
                    Entry.addressBookId, Entry.firstName, Entry.lastName \
            FROM Account JOIN AddressBook \
            ON Account.id = AddressBook.accountId \
            JOIN Entry ON AddressBook.id = Entry.addressBookId"


connection.query(query, function(err, rows, fields) {
  if (err) throw err;
  
  var results = rows.reduce( function (acc, row) {
     
    var accountFound = acc.find( function (account) {
      return account.id === row.aID;
    });
    
    if (accountFound) {
      
      var addBookFound = accountFound.addressBooks.find( function (addBook) {
        return addBook.id === row.abID;
      });
      
      if (addBookFound) {
        addBookFound.entries.push({
          id:        row.eID,
          firstName: row.firstName,
          lastName:  row.lastName
        });
      }
      else {
        accountFound.addressBooks.push({
          id:   row.abID,
          name: row.name,
          entries: [{
            id:         row.eID,
            firstName:  row.firstName,
            lastName:   row.lastName
          }]
        });
      }
    }
    else {
      
      acc.push({
        id:    row.aID,
        email: row.email,
        addressBooks: [{
          id: row.abID,
          name: row.name,
          entries: [{
            id: row.eID,
            firstName: row.firstName,
            lastName: row.lastName
          }]
        }]
      });
    }
    
    return acc;
  }, []);
  
  console.log(util.inspect(results, {depth: 10, colors: true }));
  
  connection.end();
});
