import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // We will replace this with a more robust solution later
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    fetch(`${backendUrl}/simulate/dc_motor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kp: 1, ki: 0, kd: 0 }),
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Systems</h2>
          <ul className="mt-4">
            <li className="mb-2">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                DC Motor
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                Inverted Pendulum
              </a>
            </li>
            <li className="mb-2">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
                RLC Circuit
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="p-4 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">ControlVerse</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">DC Motor Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Simulation parameters */}
            <div className="col-span-1 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
              <h3 className="font-bold mb-2">Parameters</h3>
              {/* Sliders will go here */}
            </div>

            {/* Simulation plot */}
            <div className="col-span-2 bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
              <h3 className="font-bold mb-2">Step Response</h3>
              {/* Plot will go here */}
              {data && (
                <pre className="bg-gray-200 dark:bg-gray-700 p-4 rounded-md">
                  {JSON.stringify(data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
