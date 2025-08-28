const express = require("express");

const cors = require("cors");
const { MongoClient } = require("mongodb");

const mongodb = require("mongodb");

const app = express();

const connectToDatabase = require("./DB-connection");

app.use(express.json());
app.use(cors());

// API'S

app.get("/", (req, res) => {
  res.json("you did this");
});

app.get("/todos", async (req, res) => {
  const db = await connectToDatabase();
  const todos = await db.collection("todos").find({}).toArray();

  res.json(todos);
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
