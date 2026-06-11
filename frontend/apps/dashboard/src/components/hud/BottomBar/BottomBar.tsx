import { useState } from "react";
import { COLORS } from "../../../theme";
import { SimulationStatus } from "../../../types/statuses";
import { HUD_WIDTH } from "../HudPanel/HudPanel.styled";
import {
  BarRoot,
  ControlsRow,
  CtrlButton,
  Divider,
  IconButton,
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
  onHudToggle: () => void;
}

export const BottomBar = ({
  tick,
  maxTicks,
  running,
  simStatus,
  smooth,
  onSmoothChange,
  hudVisible,
  onHudToggle,
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

        {([1, 2, 4] as const).map((s) => (
          <CtrlButton key={s} onClick={() => setSpeed(s)} $active={speed === s}>
            {s}×
          </CtrlButton>
        ))}

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

        <IconButton onClick={onHudToggle} $active={hudVisible} title={hudVisible ? "Hide HUD" : "Show HUD"}>
          {hudVisible ? "◨" : "◧"}
        </IconButton>
      </ControlsRow>

      <StatusBar>
        <StatusBarText>
          jvm://uber-sim/dispatcher · ws-frame {String(tick).padStart(6, "0")}
        </StatusBarText>
        <StatusBarText>
          {simStatus} · {smooth ? "smooth" : "tick"}@{speed}× · tick {tick}/{maxTicks}
        </StatusBarText>
      </StatusBar>
    </BarRoot>
  );
};
