import React, { useState } from 'react';

export default function App() {

  const [todos, setTodos] = useState([]);

  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = (e) => {

    e.preventDefault(); 

    if (inputValue.trim() !== '') {

      const newTodo = {
        id: Date.now(), // A simple way to get a unique key for the list item.
        text: inputValue,
      };
    
      setTodos([...todos, newTodo]);
      
      setInputValue('');
    }
  };


  const handleRemoveTodo = (idToRemove) => {
    setTodos(todos.filter(todo => todo.id !== idToRemove));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 text-center mb-6 font-inter">
          My To-Do List
        </h1>

        <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input
            type="text"
            value={inputValue}

            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm font-inter"
            placeholder="What do you need to do?"
            aria-label="New to-do item"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-transform duration-300 transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg font-inter"
          >
            Add
          </button>
        </form>

        {/* Render the list of to-do items. */}
        <ul className="space-y-3">
         
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <span className="text-gray-700 text-base md:text-lg font-inter">{todo.text}</span>
              <button
                // `onClick` event handler calls the `handleRemoveTodo` function.
                onClick={() => handleRemoveTodo(todo.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-300 p-2 rounded-full hover:bg-red-100"
                aria-label={`Remove task: ${todo.text}`}
              >
                {/* SVG for a delete icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
     
        {todos.length === 0 && (
          <p className="text-center text-gray-500 mt-6 text-sm font-inter">
            Your list is empty. Add a new task above!
          </p>
        )}
      </div>
    </div>
  );
}
