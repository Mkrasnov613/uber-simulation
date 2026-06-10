import { COLORS, FONT } from "../../theme";
import { Driver, SimulationStats } from "../../types";
import { StatsGrid } from "./StatsGrid";
import { DriverList } from "./DriverList";

interface Props {
  stats: SimulationStats | null;
  driverList: Driver[];
  activeTripsCount: number;
  visible: boolean;
}

export const HUD_WIDTH = 280;

export const HudPanel = ({ stats, driverList, activeTripsCount, visible }: Props) => {
  if (!stats) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: HUD_WIDTH,
        display: "flex",
        flexDirection: "column",
        background: COLORS.panel,
        borderLeft: `1px solid ${COLORS.panelBorder}`,
        fontFamily: FONT,
        zIndex: 20,
        overflow: "hidden",
        transform: visible ? "translateX(0)" : `translateX(${HUD_WIDTH}px)`,
        transition: "transform 0.25s ease",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "52px 12px 12px",
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            color: COLORS.textMuted,
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 5,
          }}
        >
          LIVE · 5S ROLLING
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: COLORS.textPrimary,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Fleet · City Operations
          </span>
          <div
            style={{
              padding: "2px 7px",
              borderRadius: 3,
              background: "rgba(52, 211, 153, 0.1)",
              color: COLORS.green,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            ● OK
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ flexShrink: 0 }}>
        <StatsGrid
          stats={stats}
          driverList={driverList}
          activeTripsCount={activeTripsCount}
        />
      </div>

      {/* Driver list header */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: `1px solid ${COLORS.panelBorder}`,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          SORTED BY STATUS
        </span>
        <span
          style={{
            color: COLORS.textSecondary,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Drivers
        </span>
      </div>

      <DriverList drivers={driverList} />
    </div>
  );
};
