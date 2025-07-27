import { useState, useEffect } from 'react';
import './main.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/simulate/dc_motor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kp: 1, ki: 0, kd: 0 }),
    })
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold">ControlVerse</h1>
      </header>
      <main className="p-4">
        <p>Welcome to ControlVerse!</p>
        {data && (
          <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}

export default App;
