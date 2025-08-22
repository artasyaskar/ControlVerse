import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import Plot from 'react-plotly.js';

type SystemType = 'dc_motor' | 'inverted_pendulum' | 'rlc_circuit';

function App() {
  const backendUrl = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:8000';

  const [system, setSystem] = useState<SystemType>('dc_motor');
  // Optional project id for Supabase logging via backend
  const projectIdEnv = (import.meta.env.VITE_PROJECT_ID as string | undefined);
  const projectId = projectIdEnv && !Number.isNaN(Number(projectIdEnv)) ? Number(projectIdEnv) : undefined;
  // Keep inputs as strings to avoid React controlled input NaN warnings
  const [kpStr, setKpStr] = useState<string>('1');
  const [kiStr, setKiStr] = useState<string>('0');
  const [kdStr, setKdStr] = useState<string>('0');

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // History state
  const [history, setHistory] = useState<any[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const url = new URL(`${backendUrl}/history`);
      url.searchParams.set('limit', '20');
      if (projectId !== undefined) url.searchParams.set('project_id', String(projectId));
      const res = await fetch(url.toString(), { cache: 'no-store' });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const json = await res.json();
      setHistory(Array.isArray(json?.items) ? json.items : []);
    } catch (e: any) {
      setHistoryError(e?.message || 'Failed to load history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const runSimulation = async (selected?: SystemType) => {
    const sys = selected ?? system;
    setLoading(true);
    // Clear previous data so UI doesn't show stale results while loading
    setData(null);
    setError(null);
    try {
      // Parse and validate numbers right before sending
      const kp = Number(kpStr);
      const ki = Number(kiStr);
      const kd = Number(kdStr);
      if ([kp, ki, kd].some((v) => Number.isNaN(v))) {
        throw new Error('Please enter valid numeric values for Kp, Ki, and Kd');
      }

      const res = await fetch(`${backendUrl}/simulate/${sys}`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kp, ki, kd, project_id: projectId }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const json = await res.json();
      setData(json);
      // refresh history after successful run
      loadHistory();
    } catch (e: any) {
      setError(e?.message || 'Unknown error');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial run
  useEffect(() => {
    runSimulation('dc_motor');
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const systemLabel = (s: SystemType) =>
    s === 'dc_motor' ? 'DC Motor' : s === 'inverted_pendulum' ? 'Inverted Pendulum' : 'RLC Circuit';

  const handleSystemClick = (s: SystemType) => {
    setSystem(s);
    // Optional presets per system
    if (s === 'dc_motor') {
      setKpStr('1'); setKiStr('0'); setKdStr('0');
    } else if (s === 'inverted_pendulum') {
      setKpStr('15'); setKiStr('0.5'); setKdStr('2');
    } else {
      setKpStr('2'); setKiStr('0.1'); setKdStr('0.5');
    }
    // trigger a new simulation for the selected system
    runSimulation(s);
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] shadow-lg/50 shadow-black">
        <div className="p-4">
          <h2 className="text-xl font-bold">Systems</h2>
          <ul className="mt-4">
            <li className="mb-2">
              <button
                className={`text-left w-full px-2 py-1 rounded transition-colors ${
                  system === 'dc_motor' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-blue-400'
                }`}
                onClick={() => handleSystemClick('dc_motor')}
              >
                DC Motor
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`text-left w-full px-2 py-1 rounded transition-colors ${
                  system === 'inverted_pendulum' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-blue-400'
                }`}
                onClick={() => handleSystemClick('inverted_pendulum')}
              >
                Inverted Pendulum
              </button>
            </li>
            <li className="mb-2">
              <button
                className={`text-left w-full px-2 py-1 rounded transition-colors ${
                  system === 'rlc_circuit' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-blue-400'
                }`}
                onClick={() => handleSystemClick('rlc_circuit')}
              >
                RLC Circuit
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="relative p-4 bg-[#0b1220] shadow-md border-b border-slate-800">
          <h1 className="text-2xl font-bold">ControlVerse</h1>
          {/* AY badge */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <button
              onClick={async () => { try { await supabase.auth.signOut(); } catch { /* no-op */ } }}
              className="px-3 py-1 rounded border border-slate-700 text-slate-300 hover:bg-slate-800"
              title="Sign out"
            >
              Sign out
            </button>
            <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-md">
              AY
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">{systemLabel(system)} Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Simulation parameters */}
            <div className="col-span-1 bg-[#0b1220] p-4 rounded-md shadow border border-slate-800">
              <h3 className="font-bold mb-4">Parameters</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Kp</label>
                  <input
                    type="number"
                    step="0.1"
                    value={kpStr}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKpStr(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-[#0f172a] px-2 py-1 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Ki</label>
                  <input
                    type="number"
                    step="0.1"
                    value={kiStr}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKiStr(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-[#0f172a] px-2 py-1 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Kd</label>
                  <input
                    type="number"
                    step="0.1"
                    value={kdStr}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKdStr(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-[#0f172a] px-2 py-1 text-slate-100"
                  />
                </div>
                <button
                  onClick={() => runSimulation()}
                  className="mt-2 inline-flex items-center px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || [kpStr, kiStr, kdStr].some((v) => v.trim() === '')}
                >
                  {loading ? 'Simulating…' : 'Run Simulation'}
                </button>
                {error && (
                  <p className="text-sm text-red-600 break-words">{error}</p>
                )}
              </div>
            </div>

            {/* Simulation output */}
            <div className="col-span-2 bg-[#0b1220] p-4 rounded-md shadow border border-slate-800">
              <h3 className="font-bold mb-2">Step Response</h3>
              {!data && !loading && <p className="text-sm text-gray-500">No data yet. Run a simulation.</p>}
              {data && (
                <div className="space-y-4">
                  {/* Line chart */}
                  <Plot
                    data={[
                      {
                        x: Array.isArray(data?.time) ? data.time : [],
                        y: Array.isArray(data?.response) ? data.response : [],
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: '#2563eb' },
                        name: 'Response',
                      },
                    ]}
                    layout={{
                      autosize: true,
                      height: 360,
                      paper_bgcolor: 'transparent',
                      plot_bgcolor: 'transparent',
                      margin: { l: 40, r: 10, t: 10, b: 40 },
                      xaxis: { title: 'Time (s)', gridcolor: '#1f2937', zerolinecolor: '#334155' },
                      yaxis: { title: 'Amplitude', gridcolor: '#1f2937', zerolinecolor: '#334155' },
                      font: { color: '#cbd5e1' },
                    }}
                    useResizeHandler
                    style={{ width: '100%' }}
                    config={{ displayModeBar: false }}
                  />
                  {/* Raw JSON */}
                  <pre className="bg-[#0f172a] border border-slate-800 p-4 rounded-md overflow-auto max-h-[65vh]">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* History */}
          <div className="mt-6 bg-[#0b1220] p-4 rounded-md shadow border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">Recent Sessions</h3>
              <button
                onClick={loadHistory}
                className="text-sm px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
                disabled={historyLoading}
              >
                {historyLoading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
            {historyError && <p className="text-sm text-red-500">{historyError}</p>}
            {!historyLoading && (!history || history.length === 0) && (
              <p className="text-sm text-gray-500">No history yet.</p>
            )}
            {history && history.length > 0 && (
              <div className="overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-300">
                    <tr>
                      <th className="py-2 pr-3">When</th>
                      <th className="py-2 pr-3">Project</th>
                      <th className="py-2 pr-3">Input</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => (
                      <tr key={row.id} className="border-t border-slate-800">
                        <td className="py-2 pr-3">{new Date(row.created_at).toLocaleString()}</td>
                        <td className="py-2 pr-3">{row.project_id ?? '-'}</td>
                        <td className="py-2 pr-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[30ch]">
                          {(() => {
                            const inp = row.input_data || {};
                            const s = inp.system_type ?? '—';
                            return `${s} | Kp=${inp.kp ?? '—'}, Ki=${inp.ki ?? '—'}, Kd=${inp.kd ?? '—'}`;
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
