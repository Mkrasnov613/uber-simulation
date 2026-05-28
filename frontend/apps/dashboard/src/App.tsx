import { SimulationMap } from "./components/SimulationMap";
import type { SimulationState } from "./types";
import { useEffect, useState } from "react";

const API_BASE = "/api";

async function post(path: string, body?: unknown): Promise<SimulationState> {
  const init: RequestInit = { method: "POST" };
  if (body !== undefined) {
    init.headers = { "Content-Type": "application/json" };
    init.body = JSON.stringify(body);
  }
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function App() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchState = async () => {
    try {
      const res = await fetch(`${API_BASE}/simulation/state`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SimulationState = await res.json();
      setState(data);
      setError(null);
    } catch {
      setError("Could not connect to backend. Is Docker running?");
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () =>
    post("/simulation/start")
      .then(setState)
      .catch((e) => setError(String(e)));
  const handleTick = () =>
    post("/simulation/tick")
      .then(setState)
      .catch((e) => setError(String(e)));
  const handleStop = () =>
    post("/simulation/stop")
      .then(setState)
      .catch((e) => setError(String(e)));
  const handleReset = () =>
    post("/simulation/reset")
      .then(setState)
      .catch((e) => setError(String(e)));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* control bar stays at top */}
      <div
        style={{
          padding: "0.6rem 1rem",
          display: "flex",
          gap: "0.8rem",
          background: "#111520",
          borderBottom: "1px solid #1e2535",
        }}
      >
        <button onClick={handleStart}>Start</button>
        <button onClick={handleTick}>Tick</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
        {error && <span style={{ color: "red", fontSize: 12 }}>{error}</span>}
      </div>

      {/* map fills remaining space */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <SimulationMap state={state} />
      </div>
    </div>
  );
}

export default App;
