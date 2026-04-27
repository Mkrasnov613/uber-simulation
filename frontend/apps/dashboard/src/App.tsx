import type { SimulationState } from "@uber-sim/types";
import { useEffect, useState } from "react";

const API_BASE = "/api";

function App() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`${API_BASE}/simulation/state`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SimulationState = await res.json();
        setState(data);
      } catch (err) {
        setError("Could not connect to backend. Is Docker running?");
      }
    };

    fetchState();
    const interval = setInterval(fetchState, 6000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace", color: "red" }}>
        <h2>⚠ Backend Unreachable</h2>
        <p>{error}</p>
        <pre>docker-compose up --build</pre>
      </div>
    );
  }

  if (!state) {
    return (
      <div style={{ padding: "2rem", fontFamily: "monospace" }}>
        Connecting to simulation...
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Uber Simulation Dashboard</h1>
      <p>
        Backend route <code>/simulation/state</code>is working
      </p>
    </div>
  );
}

export default App;
