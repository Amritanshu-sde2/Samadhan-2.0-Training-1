const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json()); // middleware to parse JSON

// Temporary in-memory database
let students = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 20 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 22 },
];

// CREATE - POST /students
app.post("/students", (req, res) => {
  const newStudent = { id: students.length + 1, ...req.body };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

// READ ALL - GET /students
app.get("/students", (req, res) => {
  res.json(students);
});

// READ ONE - GET /students/:id
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// UPDATE - PUT /students/:id
app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });

  student.name = req.body.name || student.name;
  student.email = req.body.email || student.email;
  student.age = req.body.age || student.age;

  res.json(student);
});

// DELETE - DELETE /students/:id
app.delete("/students/:id", (req, res) => {
  const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
  if (studentIndex === -1) return res.status(404).json({ message: "Student not found" });

  const deletedStudent = students.splice(studentIndex, 1);
  res.json(deletedStudent[0]);
});

// Start server
app.listen(PORT, () => {
  console.log(🚀 Server running on http://localhost:${PORT});
});
