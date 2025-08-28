
const { MongoClient } = require("mongodb");

let cachedDb = null;



module.exports = async function connectToDatabase(){

    // return the cached versions if they exist

    if(cachedDb) return cachedDb;


    const client = await MongoClient.connect("mongodb://localhost:27017/", {

    });

    const db = client.db("todos");

    await db.collection('todos').deleteMany({});
    
    await db.collection('todos').insertMany([
        {desc: 'First todo', completed: false},
        {desc: 'Write code', completed: true},
        {desc: 'Second todo', completed: true},
    ])
        cachedDb = db;
        return db;
    

};