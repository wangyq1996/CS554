import * as Mongo from 'mongodb';

const MongoClient: Mongo.MongoClient = require('mongodb').MongoClient;

interface mongoConfig {
    serverUrl: any;
    database: string;
}

const mongoConfig: mongoConfig = {
    serverUrl: 'mongodb://localhost:27017/',
    database: 'Wang-Yuqi-CS554-Lab1',
};

let _connection: any = undefined;
let _db: any = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl);
        _db = await _connection.db(mongoConfig.database);
    }

    return _db;
};
