import React, { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch notes
  const fetchNotes = async () => {
    const res = await fetch("http://localhost:5000/notes");
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or Update note
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Update
      await fetch(`http://localhost:5000/notes/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      setEditingId(null);
    } else {
      // Add
      await fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle("");
    setContent("");
    fetchNotes();
  };

  // Delete note
  const deleteNote = async (id) => {
    await fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  // Edit note
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📝 Notes App</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <br />
      <textarea
        placeholder="Content"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <br />
      <button onClick={saveNote}>
        {editingId ? "Update Note" : "Add Note"}
      </button>

      <ul>
        {notes.map(note => (
          <li key={note._id}>
            <strong>{note.title}</strong>: {note.content}
            <button onClick={() => editNote(note)}>✏️ Edit</button>
            <button onClick={() => deleteNote(note._id)}>❌ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
