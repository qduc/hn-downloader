var api = require('./api');
var hndownloader = require('./hndownloader');
var query = require('./query');

var maxId = 0;
var currentId = 0;
var itemTypeMap = {};

query.connect.then(function () {
    return api.getAPIMaxId;
}).then(function (result) {
    maxId = result.data;
    return query.getItemMaxId;
}).then(function (result) {
    currentId = result;
    return query.getItemTypeMap;
}).then(function (result) {
    for (let row of result) {
        itemTypeMap[row.name] = row.id;
    }
    return hndownloader.main(maxId, currentId, itemTypeMap);
}).then(function () {
    query.end();
}).catch(function (err) {
    console.log(err);
    query.end();
});
