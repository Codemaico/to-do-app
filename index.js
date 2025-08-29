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

// get all todos
app.get("/todos", async (req, res) => {
  const db = await connectToDatabase();
  const todos = await db.collection("todos").find({}).toArray();
  res.json(todos);
});

// Insert todos
app.post('/todos', async (req, res) => {
  const newTodo = req.body;
  const db = await connectToDatabase();
  await db.collection("todos").insertOne(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo's completed status
app.patch('/todos/:_id', async (req, res) => {
  const { _id } = req.params;
  const { completed } = req.body;
  const db = await connectToDatabase();
  const { ObjectId } = require("mongodb");
  let objectId;
  try {
    objectId = new ObjectId(_id);
  } catch (e) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }
  const result = await db.collection("todos").updateOne(
    { _id: objectId },
    { $set: { completed: completed } }
  );
  if (result.modifiedCount === 1) {
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Todo not found" });
  }
});

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
