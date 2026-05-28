
import { useCanvas } from '../hooks/useCanvas'
import { useSimulation } from '../hooks/useSimulation'
import { SimulationState } from '../types'

interface Props {
  state: SimulationState | null
}

export const SimulationMap = ({ state }: Props) => {
  const { canvasRef, rendererRef } = useCanvas()
  const stats = useSimulation(state, rendererRef)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />

      {stats && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          color: '#00e5c0', fontFamily: 'monospace', fontSize: 12
        }}>
          tick debug — drivers: {stats.activeDrivers}
        </div>
      )}

    </div>
  )
}