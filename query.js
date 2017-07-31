var mysql = require('mysql');
var dbParams = require('./database');

// Start mysql connection
var connection = mysql.createConnection(dbParams);

var connect = new Promise(function (resolve, reject) {
    connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            reject(err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
        resolve();
    });
});

var end = function () {
    connection.end(function (err) {
        if (err) {
            console.error('error terminating: ' + err.stack);
            return;
        }

        console.log('connection ended');
    });
};

// Get largest id from database
var getItemMaxId = new Promise(function (resolve, reject) {
    connection.query('SELECT MAX(id) AS maxId FROM items', function (error, results, fields) {
        if (error) {
            reject(error);
            return;
        }
        resolve(results[0].maxId);
    });
});

var getItemTypeMap = new Promise(function (resolve, reject) {
    connection.query('SELECT * FROM item_type', function (error, results, fields) {
        if (error) {
            reject(error);
            return;
        }
        resolve(results);
    });
});

var insert = function (table, item) {
    return new Promise(function (resolve, reject) {
        if (item.length === 0) {
            resolve();
            return;
        }
        connection.query('INSERT INTO ' + table + ' SET ?', item, function (error, results, fields) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
};

module.exports = {
    connect,
    getItemMaxId,
    getItemTypeMap,
    insert,
    end
};
