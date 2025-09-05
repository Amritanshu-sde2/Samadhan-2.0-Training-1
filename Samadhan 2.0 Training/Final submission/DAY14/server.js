// Basic Auth with JWT in one file
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// In-memory user store (use DB in real apps)
const users = [];
const SECRET = "supersecret"; // use env variable in production

// ==============================
// Register API
// ==============================
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists
  const exists = users.find((u) => u.email === email);
  if (exists) return res.status(400).json({ error: "User already exists" });

  // Hash password
  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });

  res.json({ message: "User registered successfully" });
});

// ==============================
// Login API
// ==============================
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  // Sign JWT
  const token = jwt.sign({ email }, SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful", token });
});

// ==============================
// Protected Example API
// ==============================
app.get("/api/profile", (req, res) => {
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ error: "No token provided" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ message: "Protected data", user: decoded });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// ==============================
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
