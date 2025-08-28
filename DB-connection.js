const { MongoClient } = require("mongodb");

let cachedDb = null;

module.exports = async function connectToDatabase(){

    // return the cached versions if they exist

    if(cachedDb) return cachedDb;


    const client = await MongoClient.connect("mongodb://localhost:27017", {

    });

    const db = client.db('my-database');
        cachedDb = db;
        return db;
    

};