
// Declare a variable that represents the actual api that we are building

const express = require('express');

const PORT = 8081;

const mongodb = require("mongodb");

const connectToDatabase = require('./DB-connection');


// configure app

const app = express();

app.use(express.json());



// Get all tshirts

app.get('/tshirt', async (req,res) => {

    const db = await connectToDatabase();
    
    const tshirts = await db.collection('users').find({}).toArray();

    res.json({tshirts});

});

// Add a new tshirt


app.post('/tshirt/:id', (req, res) => {
    const {id} = req.params;
    const {logo} = req.body;

    if(!logo) {
        res.status(418).send({message: 'We need a logo!!!'});
    }

    res.send({
        tshirt: `👕 with your ${logo} and ID of ${ id }`,

    })


})


// Fire up your api

app.listen(PORT, () => {
    console.log(`Tshirt API listening on port ${PORT}`);
})