import { COLORS, FONT } from "../theme";
import { Driver, SimulationConfig, SimulationStats } from "../types";
import { SimulationStatus } from "../types/statuses";
import { post } from "../utils/post";
import { SimulationWindow } from "./SimulationWindow";
interface Props {
  stats: SimulationStats;
  driverList: Driver[];
  tick: number;
  config: SimulationConfig | null;
  simStatus: SimulationStatus;
}

const Donut = ({ pct }: { pct: number }) => {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * r;
  const filled = circ * Math.min(pct, 1);
  return (
    <svg width={140} height={140} style={{ overflow: "visible" }}>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={11}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={COLORS.green}
        strokeWidth={11}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text
        x={cx}
        y={cy - 7}
        textAnchor="middle"
        fill={COLORS.textPrimary}
        fontSize={22}
        fontWeight={700}
        fontFamily={FONT}
      >
        {Math.round(pct * 100)}%
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill={COLORS.textMuted}
        fontSize={8}
        letterSpacing="0.14em"
        fontFamily={FONT}
      >
        FULFILLED
      </text>
    </svg>
  );
};

const StatCell = ({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  accent?: string;
}) => (
  <div
    style={{
      padding: "12px 14px",
      background: "rgba(255,255,255,0.02)",
      borderRadius: 6,
      border: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div
      style={{
        color: COLORS.textMuted,
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        marginBottom: 6,
      }}
    >
      {label}
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
      <span
        style={{
          color: accent ?? COLORS.textPrimary,
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </span>
      {unit && (
        <span style={{ color: COLORS.textSecondary, fontSize: 10 }}>
          {unit}
        </span>
      )}
    </div>
  </div>
);

const fmtDuration = (ticks: number) => {
  const m = Math.floor(ticks / 60);
  const s = ticks % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const SimulationSummary = ({
  stats,
  driverList,
  tick,
  config,
  simStatus,
}: Props) => {
  const fulfilled =
    stats.totalTrips > 0 ? stats.completedTrips / stats.totalTrips : 0;
  const unserved = Math.max(
    0,
    stats.totalTrips - stats.completedTrips - stats.cancelledTrips,
  );
  const driverCount = config?.driverCount ?? (driverList.length || 1);
  const tripsPerDriver = (stats.completedTrips / driverCount).toFixed(1);

  const topDrivers = [...driverList]
    .filter((d) => d.totalTripsCompleted > 0)
    .sort((a, b) => b.totalTripsCompleted - a.totalTripsCompleted)
    .slice(0, 5);

  const maxTrips = topDrivers[0]?.totalTripsCompleted ?? 1;

  const isFailed = simStatus === SimulationStatus.FAILED;

  const handleRunAgain = async () => {
    await post("reset");
  };

  return (
    <SimulationWindow>
      <div
        style={{
          padding: "24px 28px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: isFailed ? COLORS.amber : COLORS.textPrimary,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {isFailed ? "Simulation Failed" : "Simulation Complete"}
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              color: COLORS.textPrimary,
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {fmtDuration(tick)}
          </div>
          <div
            style={{
              color: COLORS.textMuted,
              fontSize: 9,
              letterSpacing: "0.12em",
              marginTop: 4,
            }}
          >
            SIM DURATION
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", gap: 0 }}>
        {/* Left: donut + legend */}
        <div
          style={{
            width: 200,
            padding: "24px 20px",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
            flexShrink: 0,
          }}
        >
          <Donut pct={fulfilled} />

          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              {
                label: "Completed",
                count: stats.completedTrips,
                color: COLORS.green,
              },
              {
                label: "Cancelled",
                count: stats.cancelledTrips,
                color: COLORS.amber,
              },
              {
                label: "Unserved",
                count: unserved,
                color: COLORS.textSecondary,
              },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: COLORS.textSecondary, fontSize: 11 }}>
                    {label}
                  </span>
                </div>
                <span
                  style={{
                    color: COLORS.textPrimary,
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: stats + top drivers */}
        <div
          style={{
            flex: 1,
            padding: "24px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {/* Stats grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            <StatCell label="Requests" value={stats.totalTrips} />
            <StatCell
              label="Completed"
              value={stats.completedTrips}
              accent={COLORS.green}
            />
            <StatCell
              label="Cancelled"
              value={stats.cancelledTrips}
              accent={COLORS.amber}
            />
            <StatCell
              label="Avg Wait"
              value={stats.averageWaitTimeSeconds.toFixed(1)}
              unit="s"
            />
            <StatCell
              label="Avg Trip"
              value={stats.averageTripDurationSeconds.toFixed(1)}
              unit="s"
            />
            <StatCell label="Unserved" value={unserved} />
            <StatCell
              label="Earnings"
              value={`$${Math.round(stats.totalEarnings)}`}
              accent={COLORS.green}
            />
            <StatCell
              label="Avg Fare"
              value={`$${stats.averageFare.toFixed(1)}`}
            />
            <StatCell label="Trips / Driver" value={tripsPerDriver} />
          </div>

          {/* Top Drivers */}
          {topDrivers.length > 0 && (
            <div>
              <div
                style={{
                  color: COLORS.textMuted,
                  fontSize: 9,
                  letterSpacing: "0.12em",
                  marginBottom: 10,
                }}
              >
                TOP DRIVERS
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {topDrivers.map((d, i) => (
                  <div
                    key={d.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "14px 110px 1fr 60px 40px",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ color: COLORS.textMuted, fontSize: 10 }}>
                      {i + 1}
                    </span>
                    <span
                      style={{
                        color: COLORS.textPrimary,
                        fontSize: 11,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.name}
                    </span>
                    <div
                      style={{
                        height: 4,
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.06)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(d.totalTripsCompleted / maxTrips) * 100}%`,
                          background: COLORS.green,
                          borderRadius: 2,
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: COLORS.textSecondary,
                        fontSize: 10,
                        textAlign: "right",
                      }}
                    >
                      {d.totalTripsCompleted} trip
                      {d.totalTripsCompleted !== 1 ? "s" : ""}
                    </span>
                    <span
                      style={{
                        color: COLORS.green,
                        fontSize: 10,
                        textAlign: "right",
                      }}
                    >
                      ${Math.round(d.totalEarnings)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 28px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleRunAgain}
          style={{
            padding: "8px 20px",
            borderRadius: 6,
            background: COLORS.green,
            border: "none",
            color: "#0a0e15",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: FONT,
            letterSpacing: "0.04em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          Run again ↺
        </button>
      </div>
    </SimulationWindow>
  );
};
