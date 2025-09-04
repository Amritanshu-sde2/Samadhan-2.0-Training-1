import React, { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Fetch todos
  useEffect(() => {
    fetch("http://localhost:4000/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch("http://localhost:4000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json();
    setTodos([...todos, newTodo]);
    setText("");
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:4000/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ To-Do App</h1>
      <div>
        <input
          type="text"
          value={text}
          placeholder="Enter a task"
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}{" "}
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
