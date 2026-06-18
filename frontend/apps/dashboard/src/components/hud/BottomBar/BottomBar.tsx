import { useState } from "react";
import { COLORS } from "../../../theme";
import { SimulationStatus } from "../../../types/statuses";
import { HUD_WIDTH } from "../HudPanel/HudPanel.styled";
import {
  BarRoot,
  ControlsRow,
  CtrlButton,
  Divider,
  LegendDot,
  LegendItem,
  LegendLabel,
  LegendWrapper,
  StatusBar,
  StatusBarText,
  TickCounter,
} from "./BottomBar.styled";

const API = "http://localhost:8080/api/simulation";
const post = (path: string) =>
  fetch(`${API}/${path}`, { method: "POST" }).catch(() => {});

const LEGEND = [
  { label: "Idle driver", color: COLORS.driverAvailable },
  { label: "En route to pickup", color: COLORS.driverEnRoute },
  { label: "In trip", color: COLORS.driverOnTrip },
  { label: "Ride request", color: COLORS.passenger },
];

interface Props {
  tick: number;
  maxTicks: number;
  running: boolean;
  simStatus: SimulationStatus;
  smooth: boolean;
  onSmoothChange: (v: boolean) => void;
  hudVisible: boolean;
}

export const BottomBar = ({
  tick,
  maxTicks,
  running,
  simStatus,
  smooth,
  onSmoothChange,
  hudVisible,
}: Props) => {
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  const isFinished =
    simStatus === SimulationStatus.COMPLETED ||
    simStatus === SimulationStatus.FAILED;

  return (
    <BarRoot $hudVisible={hudVisible} $hudWidth={HUD_WIDTH}>
      <ControlsRow>
        {!isFinished && simStatus !== SimulationStatus.IDLE && (
          <>
            {running ? (
              <CtrlButton onClick={() => post("stop")} $danger>
                STOP
              </CtrlButton>
            ) : (
              <CtrlButton onClick={() => post("resume")} $active>
                RESUME
              </CtrlButton>
            )}
            <CtrlButton onClick={() => post("reset")}>RESET</CtrlButton>
            <Divider />
          </>
        )}

        <Divider />

        <CtrlButton onClick={() => onSmoothChange(true)} $active={smooth}>
          SMOOTH
        </CtrlButton>
        <CtrlButton onClick={() => onSmoothChange(false)} $active={!smooth}>
          TICK
        </CtrlButton>

        <TickCounter>
          {tick}/{maxTicks}
        </TickCounter>

        <LegendWrapper>
          {LEGEND.map((l) => (
            <LegendItem key={l.label}>
              <LegendDot $color={l.color} />
              <LegendLabel>{l.label}</LegendLabel>
            </LegendItem>
          ))}
        </LegendWrapper>
      </ControlsRow>

    </BarRoot>
  );
};
