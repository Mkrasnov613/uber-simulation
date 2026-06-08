import { useState } from "react";
import { SimulationMap } from "./components/SimulationMap";
import { TopBar } from "./components/hud/TopBar";
import { HudPanel } from "./components/hud/HudPanel";
import { BottomBar } from "./components/hud/BottomBar";
import { useRoadMap } from "./hooks/useRoadMap";
import { useSimulation } from "./hooks/useSimulation";
import { COLORS, FONT } from "./theme";

const App = () => {
  const roadMap = useRoadMap();
  const { drivers, passengers, trips, tickStart, status, tick, stats, driverList, activeTripsCount } =
    useSimulation({ url: "ws://localhost:8080/ws/state" });

  const [smooth, setSmooth] = useState(true);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: COLORS.bg,
        overflow: "hidden",
        fontFamily: FONT,
      }}
    >
      {roadMap && (
        <SimulationMap
          roadMap={roadMap}
          drivers={drivers}
          passengers={passengers}
          trips={trips}
          tickStart={tickStart}
          smooth={smooth}
        />
      )}

      <TopBar wsStatus={status} />

      <HudPanel
        stats={stats}
        driverList={driverList}
        activeTripsCount={activeTripsCount}
      />

      <BottomBar tick={tick} smooth={smooth} onSmoothChange={setSmooth} />
    </div>
  );
};

export default App;
