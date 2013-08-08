var databaseUrl = 'taskdb';
var collections = ['tasks','sections'];
var db = require('mongojs').connect(databaseUrl, collections);

module.exports = db;