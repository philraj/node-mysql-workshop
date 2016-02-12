var mysql = require('mysql');
var colors = require('colors');
var Table = require('cli-table');
var util = require("util");
var _ = require("lodash");

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

var query = "SELECT Account.id as aID, Account.email, AddressBook.id as abID, \
                    AddressBook.accountId, AddressBook.name, Entry.id as eID, \
                    Entry.addressBookId, Entry.firstName, Entry.lastName, \
                    Phone.id as pID, Phone.entryId, Phone.type, Phone.subtype,\
                      Phone.phoneNumber,\
                    Email.id as emID, Email.entryId, Email.type, Email.address,\
                    Address.id as addID, Address.entryId, Address.type,\
                      Address.line1, Address.line2, Address.city, Address.state,\
                      Address.country, Address.zip\
\
        FROM        Account\
        JOIN        AddressBook   ON      Account.id = AddressBook.accountId \
        JOIN        Entry         ON  AddressBook.id = Entry.addressBookId\
        JOIN        Phone         ON        Entry.id = Phone.entryId\
        JOIN        Email         ON        Entry.id = Email.entryId\
        LEFT JOIN   Address       ON        Entry.id = Address.entryId"


connection.query(query, function(err, rows) {
  if (err) throw err;
  
  var acctGroup = _.groupBy(rows, function (row) {
    return row.aID;
  });
  
  var keys = Object.keys(acctGroup);
  
  var acctMapped = keys.map( function(key) {
    var bookGroup = _.groupBy(acctGroup[key], function (row) {
      return row.abID;
    });
    
    var bookKeys = Object.keys(bookGroup);
    
    return {
      id: key,
      email: acctGroup[key][0].email,
      AddressBooks: bookKeys.map( function (key) {
        var entryGroup = _.groupBy(bookGroup[key], function(row) {
          return row.eID;
        });

        var entryKeys = Object.keys(entryGroup);
        
        return {
          id: key,
          name: bookGroup[key][0].name,
          entries: entryKeys.map( function (key) {
            var emailGroup = _.groupBy(entryGroup[key], function (row) {
              return row.emID;
            });
            
            var emailKeys = Object.keys(emailGroup);
            
            var phoneGroup = _.groupBy(entryGroup[key], function (row) {
              return row.pID;
            });
            
            var phoneKeys = Object.keys(phoneGroup);
            
            var addressGroup = _.groupBy(entryGroup[key], function (row) {
              return row.addID;
            });
            
            var addressKeys = Object.keys(addressGroup);
            
            return {
              id: key,
              firstName: entryGroup[key][0].firstName,
              lastName: entryGroup[key][0].lastName,
              birthday: entryGroup[key][0].birthday,
              emails: emailKeys.map( function (key) {
                return {
                  type: emailGroup[key][0].type,
                  address: emailGroup[key][0].address
                }
              }),
              phones: phoneKeys.map( function (key) {
                return {
                  type: phoneGroup[key][0].type,
                  subtype: phoneGroup[key][0].subtype,
                  phoneNumber: phoneGroup[key][0].phoneNumber
                }
              }),
              addresses: addressKeys.map( function (key) {
                return {
                  type: addressGroup[key][0].type,
                  line1: addressGroup[key][0].line1,
                  line2: addressGroup[key][0].line2,
                  city: addressGroup[key][0].city,
                  state: addressGroup[key][0].state,
                  country: addressGroup[key][0].country,
                  zip: addressGroup[key][0].zip
                }
              })
            }
          })
        }
      })
    };
  });
  
  console.log(util.inspect(acctMapped, {depth: 16, colors: true }));
  connection.end();
});

