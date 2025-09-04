const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory DB
let todos = [
  { id: 1, text: "Learn React" },
  { id: 2, text: "Build To-Do App" },
];

// GET all todos
app.get("/todos", (req, res) => {
  res.json(todos);
});

// ADD a todo
app.post("/todos", (req, res) => {
  const newTodo = { id: Date.now(), text: req.body.text };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ message: "Todo deleted", id });
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
