import { MapCanvas } from "./canvas/map/MapCanvas";
import { useSimulation } from "./hooks/useSimulation";
import { BOUNDS } from "./constants/mapBounds";
const App = () => {
  const { drivers, passengers, trips, tickStart, status, tick } = useSimulation(
    {
      url: "ws://localhost:8080/ws/state",
    },
  );

  return (
    <div style={{ width: "100%", height: 600 }}>
      <MapCanvas
        bounds={BOUNDS}
        drivers={drivers}
        passengers={passengers}
        trips={trips}
        tickStart={tickStart}
      />
      <div>
        {status} · tick {tick}
      </div>
    </div>
  );
};

export default App;
