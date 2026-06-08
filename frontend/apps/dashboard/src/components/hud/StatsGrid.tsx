import { COLORS, FONT } from "../../theme";
import { Driver, DriverStatus, SimulationStats } from "../../types";

interface Props {
  stats: SimulationStats;
  driverList: Driver[];
  activeTripsCount: number;
}

const Cell = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <div style={{ padding: "10px 12px" }}>
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
      {label}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
      <span
        style={{
          color: COLORS.textPrimary,
          fontSize: 26,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
      {unit && (
        <span
          style={{ color: COLORS.textSecondary, fontSize: 10, fontWeight: 500 }}
        >
          {unit}
        </span>
      )}
    </div>
  </div>
);

export const StatsGrid = ({ stats, driverList, activeTripsCount }: Props) => {
  const onTrip = driverList.filter(
    (d) => d.status === DriverStatus.ON_TRIP,
  ).length;
  const enRoute = driverList.filter(
    (d) => d.status === DriverStatus.EN_ROUTE_TO_PASSENGER,
  ).length;
  const online = driverList.filter(
    (d) => d.status !== DriverStatus.OFFLINE,
  ).length;

  return (
    <div style={{ fontFamily: FONT }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: `1px solid ${COLORS.panelDivider}`,
        }}
      >
        <div style={{ borderRight: `1px solid ${COLORS.panelDivider}` }}>
          <Cell label="Active Trips" value={activeTripsCount} />
        </div>
        <div style={{ borderRight: `1px solid ${COLORS.panelDivider}` }}>
          <Cell label="Drivers Online" value={online} />
        </div>
        <Cell label="Waiting" value={stats.waitingPassengers} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          borderBottom: `1px solid ${COLORS.panelDivider}`,
        }}
      >
        <div style={{ borderRight: `1px solid ${COLORS.panelDivider}` }}>
          <Cell label="On Trip" value={onTrip} />
        </div>
        <div style={{ borderRight: `1px solid ${COLORS.panelDivider}` }}>
          <Cell label="En Route" value={enRoute} />
        </div>
        <Cell
          label="Avg Wait"
          value={stats.averageWaitTimeSeconds.toFixed(1)}
          unit="s"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderBottom: `1px solid ${COLORS.panelDivider}`,
        }}
      >
        <span
          style={{
            color: COLORS.textMuted,
            fontSize: 10,
            letterSpacing: "0.04em",
          }}
        >
          completed_trips
        </span>
        <span
          style={{
            color: COLORS.textSecondary,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {String(stats.completedTrips).padStart(4, "0")}
        </span>
      </div>
    </div>
  );
};
