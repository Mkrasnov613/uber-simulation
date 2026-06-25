import { useState } from "react";
import { SimulationMap } from "../components/SimulationMap/SimulationMap";
import { TopBar } from "../components/hud/TopBar/TopBar";
import { HudPanel } from "../components/hud/HudPanel/HudPanel";
import { BottomBar } from "../components/hud/BottomBar/BottomBar";
import { SimulationSummary } from "../components/SimulationSummary/SimulationSummary";
import { SimulationSetup } from "../components/SimulationSetup/SimulationSetup";
import { useRoadMap } from "../hooks/useRoadMap";
import { useSimulation } from "../hooks/useSimulation";
import { WS_URL } from "../config";
import { SimulationStatus } from "../types/statuses";
import { AppRoot } from "./App.styled";

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
  } = useSimulation({ url: WS_URL });

  const [smooth, setSmooth] = useState(true);
  const [hudVisible, setHudVisible] = useState(true);

  const isFinished =
    simStatus === SimulationStatus.COMPLETED ||
    simStatus === SimulationStatus.FAILED;

  const maxTicks = config?.maxTicks ?? 0;

  return (
    <AppRoot>
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

      <TopBar
        wsStatus={status}
        hudVisible={hudVisible && !isFinished}
        onHudToggle={() => setHudVisible((v) => !v)}
      />

      <HudPanel
        stats={stats}
        driverList={driverList}
        activeTripsCount={activeTripsCount}
        visible={hudVisible && !isFinished}
        config={config}
      />

      <BottomBar
        tick={tick}
        maxTicks={maxTicks}
        running={running}
        simStatus={simStatus}
        smooth={smooth}
        onSmoothChange={setSmooth}
        hudVisible={hudVisible && !isFinished}
      />

      {simStatus === SimulationStatus.IDLE && <SimulationSetup />}

      {isFinished && stats && (
        <SimulationSummary
          stats={stats}
          driverList={driverList}
          tick={tick}
          config={config}
          simStatus={simStatus}
        />
      )}
    </AppRoot>
  );
};

export default App;
