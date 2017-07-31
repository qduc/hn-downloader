var api = require('./api');
var query = require('./query');

var noOfInsertItem = 100;
var concurrentFetch = 10;

var parseItem = function (rawItem, itemTypeMap) {
    let {
        id,
        deleted,
        type,
        by,
        time,
        text,
        dead,
        parent,
        poll,
        kids,
        url,
        score,
        title,
        parts,
        descendants
    } = rawItem;

    let item = {
        id,
        deleted,
        // type,
        by,
        // time,
        text,
        dead,
        // kids,
        url,
        score,
        title,
        // parts,
        descendants
    };

    if (!itemTypeMap.hasOwnProperty(type)) {
        return false;
    }

    item.type_id = itemTypeMap[type];
    item.time = new Date(rawItem.time * 1000);

    let itemRelation = [];

    let createItemRelation = function (childArray) {
        for (let child of childArray) {
            itemRelation.push({
                item_id: id,
                child_id: child
            });
        }
    };

    if (typeof kids !== 'undefined') {
        createItemRelation(kids);
    }
    if (typeof parts !== 'undefined') {
        createItemRelation(parts);
    }

    return {
        item,
        itemRelation
    }
};

var main = function (maxId, startId, itemTypeMap) {
    return new Promise(function (resolve, reject) {
        // Exit if latest item is already inserted
        if (startId === maxId) {
            console.log('Database is up to date. Exiting.');
            resolve();
            return;
        }

        (function fetchAndInsert(currentId) {
            let fetchAPIPromises = [];
            let endId = Math.min(currentId + concurrentFetch, startId + noOfInsertItem);

            for (let id = currentId + 1; id <= endId; id++) {
                fetchAPIPromises.push(api.getAPIItemById(id));
            }

            Promise.all(fetchAPIPromises).then(function (results) {
                let insertPromises = [];
                for (let result of results) {
                    let parsedItem = parseItem(result.data, itemTypeMap);
                    if (parsedItem) {
                        console.log(parsedItem);
                        insertPromises.push(query.insert('items', parsedItem.item));
                        insertPromises.push(query.insert('item_relation', parsedItem.itemRelation));
                    }
                }
                Promise.all(insertPromises).then(function () {
                    if (endId === startId + noOfInsertItem) {
                        resolve();
                    } else {
                        fetchAndInsert(endId);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        })(startId);

    });
};

module.exports = {
    main
};