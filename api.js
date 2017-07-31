var axios = require('axios');
var baseUrl = 'https://hacker-news.firebaseio.com/v0';

// Get max item id
var getAPIMaxId = axios.get(baseUrl + '/maxitem.json');

var getAPIItemById = function (id) {
    return axios.get(baseUrl + '/item/' + id + '.json');
};

module.exports = {
    getAPIMaxId,
    getAPIItemById
};
