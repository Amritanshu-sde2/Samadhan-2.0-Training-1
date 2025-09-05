const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const users = [];
const SECRET = "secret123";

// Register
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });
  res.json({ message: "User registered" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Protected route
app.get("/api/profile", (req, res) => {
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ error: "No token" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Profile data", user: decoded });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
