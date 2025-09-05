const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/notesdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));

// Schema & Model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
}, { timestamps: true });

const Note = mongoose.model("Note", noteSchema);

// CREATE
app.post("/notes", async (req, res) => {
  const note = new Note(req.body);
  await note.save();
  res.status(201).json(note);
});

// READ all
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// READ one
app.get("/notes/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
});

// UPDATE
app.put("/notes/:id", async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedNote) return res.status(404).json({ message: "Note not found" });
  res.json(updatedNote);
});

// DELETE
app.delete("/notes/:id", async (req, res) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);
  if (!deletedNote) return res.status(404).json({ message: "Note not found" });
  res.json({ message: "Note deleted" });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
