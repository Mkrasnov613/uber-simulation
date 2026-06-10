import { useState } from "react";
import { SimulationMap } from "./components/SimulationMap";
import { TopBar } from "./components/hud/TopBar";
import { HudPanel } from "./components/hud/HudPanel";
import { BottomBar } from "./components/hud/BottomBar";
import { SimulationSummary } from "./components/SimulationSummary";
import { SimulationSetup } from "./components/SimulationSetup";
import { useRoadMap } from "./hooks/useRoadMap";
import { useSimulation } from "./hooks/useSimulation";
import { COLORS, FONT } from "./theme";
import { SimulationStatus } from "./types/statuses";

const App = () => {
  const roadMap = useRoadMap();
  const {
    drivers,
    passengers,
    trips,
    tickStart,
    status,
    simStatus,
    running,
    tick,
    config,
    stats,
    driverList,
    activeTripsCount,
  } = useSimulation({ url: "ws://localhost:8080/ws/state" });

  const [smooth, setSmooth] = useState(true);
  const [hudVisible, setHudVisible] = useState(true);

  const isFinished =
    simStatus === SimulationStatus.COMPLETED ||
    simStatus === SimulationStatus.FAILED;

  const maxTicks = config?.maxTicks ?? 0;

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
        visible={hudVisible && !isFinished}
      />

      <BottomBar
        tick={tick}
        maxTicks={maxTicks}
        running={running}
        simStatus={simStatus}
        smooth={smooth}
        onSmoothChange={setSmooth}
        hudVisible={hudVisible && !isFinished}
        onHudToggle={() => setHudVisible((v) => !v)}
      />

      {simStatus === SimulationStatus.IDLE &&  <SimulationSetup />}

      {isFinished && stats && (
        <SimulationSummary
          stats={stats}
          driverList={driverList}
          tick={tick}
          config={config}
          simStatus={simStatus}
        />
      )}
    </div>
  );
};

export default App;
