const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;

const mongoConnect = (callback) => {
    console.log('-----------connecting-----------');
    MongoClient.connect("mongodb://127.0.0.1:27017")
        .then((result) => {
            console.log('connected');
            callback(result);
            db = result.db();
        }).catch((err) => {
            console.log(err);
        });
}

const getdb = () => {
    if (db) {
        return db;
    }
}

module.exports = { mongoConnect, getdb };