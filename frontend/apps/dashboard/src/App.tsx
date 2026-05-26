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
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Uber Simulation Dashboard</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error} — <code>docker-compose up --build</code>
        </p>
      )}

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
        <button onClick={handleStart}>Start</button>
        <button onClick={handleTick}>Tick</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {state && (
        <>
          <p>
            Status: <strong>{state.status}</strong> | Tick:{" "}
            <strong>{state.tick}</strong>
          </p>

          <h2>Stats</h2>
          <pre>{JSON.stringify(state.stats, null, 2)}</pre>

          <h2>Drivers ({state.drivers?.length ?? 0})</h2>
          <pre>{JSON.stringify(state.drivers, null, 2)}</pre>

          <h2>Passengers ({state.passengers?.length ?? 0})</h2>
          <pre>{JSON.stringify(state.passengers, null, 2)}</pre>

          <h2>Active Trips ({state.activeTrips?.length ?? 0})</h2>
          <pre>{JSON.stringify(state.activeTrips, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
