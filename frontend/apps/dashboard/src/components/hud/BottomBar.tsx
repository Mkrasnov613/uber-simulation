import { CSSProperties, useState } from "react";
import { COLORS, FONT } from "../../theme";
import { HUD_WIDTH } from "./HudPanel";
import { SimulationStatus } from "../../types/statuses";

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
    simStatus === SimulationStatus.COMPLETED || simStatus === SimulationStatus.FAILED;

  const btn = (active: boolean, danger?: boolean): CSSProperties => ({
    padding: "4px 10px",
    borderRadius: 4,
    background: danger
      ? "rgba(239, 68, 68, 0.1)"
      : active
        ? COLORS.btnActiveBg
        : COLORS.btnBg,
    border: `1px solid ${
      danger
        ? "rgba(239, 68, 68, 0.3)"
        : active
          ? COLORS.btnActiveBorder
          : COLORS.btnBorder
    }`,
    color: danger
      ? COLORS.red
      : active
        ? COLORS.btnActiveText
        : COLORS.textSecondary,
    fontSize: 10,
    fontWeight: 600,
    fontFamily: FONT,
    letterSpacing: "0.05em",
    cursor: "pointer",
    userSelect: "none",
  });

  const iconBtn = (active: boolean): CSSProperties => ({
    ...btn(active),
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontSize: 13,
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: hudVisible ? HUD_WIDTH : 0,
        fontFamily: FONT,
        zIndex: 100,
        transition: "right 0.25s ease",
      }}
    >
      {/* Controls row */}
      <div
        style={{
          padding: "32px 14px 8px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background:
            "linear-gradient(0deg, rgba(8,12,20,0.97) 0%, rgba(8,12,20,0) 100%)",
        }}
      >
        {/* Controls — hidden on IDLE (SimulationSetup modal handles it) and when finished */}
        {!isFinished && simStatus !== SimulationStatus.IDLE && (
          <>
            {running ? (
              <button onClick={() => post("stop")} style={btn(false, true)}>
                STOP
              </button>
            ) : (
              <button onClick={() => post("resume")} style={btn(true)}>
                RESUME
              </button>
            )}
            <button onClick={() => post("reset")} style={btn(false)}>
              RESET
            </button>

            <div
              style={{
                width: 1,
                height: 16,
                background: COLORS.panelBorder,
                margin: "0 2px",
              }}
            />
          </>
        )}

        {/* Speed */}
        {([1, 2, 4] as const).map((s) => (
          <button key={s} onClick={() => setSpeed(s)} style={btn(speed === s)}>
            {s}×
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 16,
            background: COLORS.panelBorder,
            margin: "0 2px",
          }}
        />

        <button onClick={() => onSmoothChange(true)} style={btn(smooth)}>
          SMOOTH
        </button>
        <button onClick={() => onSmoothChange(false)} style={btn(!smooth)}>
          TICK
        </button>

        {/* Tick counter */}
        <div
          style={{
            marginLeft: 8,
            padding: "3px 9px",
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${COLORS.panelBorder}`,
            color: COLORS.textSecondary,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            userSelect: "none",
          }}
        >
          {tick}/{maxTicks}
        </div>

        {/* Spacer + legend */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {LEGEND.map((l) => (
            <div
              key={l.label}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: l.color,
                }}
              />
              <span
                style={{
                  color: COLORS.textMuted,
                  fontSize: 9,
                  letterSpacing: "0.04em",
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>

        {/* HUD toggle */}
        <button
          onClick={onHudToggle}
          style={iconBtn(hudVisible)}
          title={hudVisible ? "Hide HUD" : "Show HUD"}
        >
          {hudVisible ? "◨" : "◧"}
        </button>
      </div>

      {/* Status bar */}
      <div
        style={{
          padding: "5px 14px",
          background: "rgba(8, 12, 20, 0.97)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${COLORS.panelDivider}`,
        }}
      >
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 9,
            letterSpacing: "0.04em",
          }}
        >
          jvm://uber-sim/dispatcher · ws-frame {String(tick).padStart(6, "0")}
        </span>
        <span style={{ color: COLORS.textMuted, fontSize: 9 }}>
          {simStatus} · {smooth ? "smooth" : "tick"}@{speed}× · tick {tick}/{maxTicks}
        </span>
      </div>
    </div>
  );
};
