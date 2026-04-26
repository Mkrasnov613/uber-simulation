import type { SimulationState } from '@uber-sim/types'
import { useEffect, useState } from 'react'

const API_BASE = '/api'

function App() {
  const [state, setState] = useState<SimulationState | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(`${API_BASE}/simulation/state`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: SimulationState = await res.json()
        setState(data)
      } catch (err) {
        setError('Could not connect to backend. Is Docker running?')
      }
    }

    fetchState()
    const interval = setInterval(fetchState, 2000) // poll every 2s
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'red' }}>
        <h2>⚠ Backend Unreachable</h2>
        <p>{error}</p>
        <pre>docker-compose up --build</pre>
      </div>
    )
  }

  if (!state) {
    return <div style={{ padding: '2rem', fontFamily: 'monospace' }}>Connecting to simulation...</div>
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Uber Simulation Dashboard</h1>
      <p>Tick: {state.tick} | Running: {String(state.running)}</p>
      <p>Drivers: {state.drivers.length} | Active Trips: {state.activeTrips.length}</p>
      {/* TODO: Replace with real visualization components */}
    </div>
  )
}

export default App
