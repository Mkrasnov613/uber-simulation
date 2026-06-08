import { CSSProperties, useState } from "react";
import { COLORS, FONT } from "../../theme";
import { HUD_WIDTH } from "./HudPanel";

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
  smooth: boolean;
  onSmoothChange: (v: boolean) => void;
}

export const BottomBar = ({ tick, smooth, onSmoothChange }: Props) => {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);

  const togglePause = async () => {
    await post(paused ? "start" : "stop");
    setPaused((p) => !p);
  };

  const handleReset = () => post("reset");

  const btn = (active: boolean): CSSProperties => ({
    padding: "4px 10px",
    borderRadius: 4,
    background: active ? COLORS.btnActiveBg : COLORS.btnBg,
    border: `1px solid ${active ? COLORS.btnActiveBorder : COLORS.btnBorder}`,
    color: active ? COLORS.btnActiveText : COLORS.textSecondary,
    fontSize: 10,
    fontWeight: 600,
    fontFamily: FONT,
    letterSpacing: "0.05em",
    cursor: "pointer",
    userSelect: "none",
  });

  const iconBtn = (): CSSProperties => ({
    ...btn(false),
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    fontSize: 12,
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: HUD_WIDTH,
        fontFamily: FONT,
        zIndex: 10,
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
        <button onClick={togglePause} style={iconBtn()}>
          {paused ? "▶" : "⏸"}
        </button>

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

        <div
          style={{
            width: 1,
            height: 16,
            background: COLORS.panelBorder,
            margin: "0 2px",
          }}
        />

        <button onClick={handleReset} style={btn(false)}>
          RESET
        </button>

        {/* Legend */}
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
          tick {tick} · {smooth ? "smooth" : "tick"}@{speed}× · t+{tick}s
        </span>
      </div>
    </div>
  );
};
