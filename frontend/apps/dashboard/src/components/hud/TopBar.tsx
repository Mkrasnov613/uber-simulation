import { useEffect, useState } from "react";
import { COLORS, FONT } from "../../theme";
import type { WsStatus } from "../../hooks/useSimulation";

const HUD_WIDTH = 280;

interface Props {
  wsStatus: WsStatus;
}

export const TopBar = ({ wsStatus }: Props) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const isLive = wsStatus === "open";
  const timeStr = time.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: HUD_WIDTH,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        background:
          "linear-gradient(180deg, rgba(8,12,20,0.97) 0%, rgba(8,12,20,0) 100%)",
        fontFamily: FONT,
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: COLORS.textPrimary,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          lineHeight: 1,
        }}
      >
        Uber-simulation · Dispatcher
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: isLive ? COLORS.green : COLORS.red,
              boxShadow: isLive ? `0 0 8px ${COLORS.green}99` : "none",
            }}
          />
          <span
            style={{
              color: isLive ? COLORS.green : COLORS.red,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {isLive ? "LIVE" : "OFFLINE"}
          </span>
        </div>
        <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>
          {timeStr}
        </span>
      </div>
    </div>
  );
};
