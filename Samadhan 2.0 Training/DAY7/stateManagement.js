import React, { useState } from 'react';
 

function App() {

  const [count, setCount] = useState(0);


  const [text, setText] = useState('');

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React State Management: Day 7</h1>
        <div className="component-container">

          <div className="counter-section">
            <h2>Counter</h2>
            <p>Current Count: {count}</p>
            <div className="button-group">
              <button onClick={() => setCount(count + 1)}>Increment</button>
              <button onClick={() => setCount(count - 1)}>Decrement</button>
            </div>
          </div>
          
       
          <div className="text-preview-section">
            <h2>Live Text Preview</h2>
            <input
              type="text"
              value={text}
              onChange={handleTextChange}
              placeholder="Start typing..."
            />
            <p>You typed: **{text}**</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
