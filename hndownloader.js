var api = require('./api');
var query = require('./query');
var config = require('./config');

var {concurrentFetch, maxRetry} = config;

var parseItem = function (rawItem, itemTypeMap) {
    if (rawItem === null) {
        return false;
    }

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

var main = function (maxId, startId, endId, itemTypeMap) {
    return new Promise(function (resolve, reject) {
        // Exit if latest item is already inserted
        if (startId === maxId) {
            console.log('Database is up to date. Exiting.');
            resolve();
            return;
        }

        if (typeof endId === 'undefined') {
            endId = maxId;
        } else {
            endId = Math.min(endId, maxId);
        }

        (function fetchAndInsert(currentId, errors) {
            let fetchAPIPromises = [];
            let currentFetchEndId = Math.min(currentId + concurrentFetch, endId);

            for (let id = currentId + 1; id <= currentFetchEndId; id++) {
                fetchAPIPromises.push(api.getAPIItemById(id));
            }

            Promise.all(fetchAPIPromises).then(function (results) {
                let insertPromises = [];
                for (let result of results) {
                    let parsedItem = parseItem(result.data, itemTypeMap);
                    if (parsedItem) {
                        if ((parsedItem.item.id % concurrentFetch === 0) || parsedItem.item.id === endId) {
                            console.log(parsedItem.item.id + '/' + endId);
                        }
                        insertPromises.push(query.insert('items', parsedItem.item));
                        insertPromises.push(query.insert('item_relation', parsedItem.itemRelation));
                    }
                }
                Promise.all(insertPromises).then(function () {
                    if (currentFetchEndId === endId) {
                        resolve();
                    } else {
                        fetchAndInsert(currentFetchEndId, 0);
                    }
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                if (errors === maxRetry) {
                    reject(err);
                } else {
                    errors++;
                    console.error('Network error. Retrying...' + errors + '/' + maxRetry);
                    fetchAndInsert(currentId, errors);
                }
            });
        })(startId, 0);

    });
};

module.exports = {
    main
};