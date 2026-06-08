import { COLORS, FONT } from "../../theme";
import { Driver, DriverStatus } from "../../types";

interface Props {
  drivers: Driver[];
}

const BADGE: Record<DriverStatus, { label: string; color: string; bg: string }> =
  {
    [DriverStatus.ON_TRIP]: {
      label: "ON TRIP",
      color: COLORS.green,
      bg: "rgba(52, 211, 153, 0.1)",
    },
    [DriverStatus.EN_ROUTE_TO_PASSENGER]: {
      label: "PICKUP",
      color: COLORS.amber,
      bg: "rgba(245, 177, 61, 0.1)",
    },
    [DriverStatus.AVAILABLE]: {
      label: "IDLE",
      color: COLORS.textSecondary,
      bg: "rgba(120, 144, 180, 0.08)",
    },
    [DriverStatus.OFFLINE]: {
      label: "OFFLINE",
      color: COLORS.textMuted,
      bg: "rgba(50, 70, 90, 0.15)",
    },
  };

const ORDER: Record<DriverStatus, number> = {
  [DriverStatus.ON_TRIP]: 0,
  [DriverStatus.EN_ROUTE_TO_PASSENGER]: 1,
  [DriverStatus.AVAILABLE]: 2,
  [DriverStatus.OFFLINE]: 3,
};

export const DriverList = ({ drivers }: Props) => {
  const sorted = [...drivers].sort(
    (a, b) => ORDER[a.status] - ORDER[b.status],
  );

  return (
    <div style={{ overflowY: "auto", flex: 1, fontFamily: FONT }}>
      {sorted.map((driver, i) => {
        const badge = BADGE[driver.status];
        const parts = driver.name.split(" ");
        const name =
          parts[0] + (parts[1] ? " " + parts[1][0] + "." : "");

        return (
          <div
            key={driver.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "7px 10px",
              borderBottom: `1px solid ${COLORS.panelDivider}`,
              gap: 8,
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 3,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.textMuted,
                fontSize: 9,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {String(i).padStart(2, "0")}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  color: COLORS.textPrimary,
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </div>
              <div
                style={{
                  color: COLORS.textMuted,
                  fontSize: 9,
                  marginTop: 1,
                }}
              >
                ★ {driver.rating.toFixed(2)} · {driver.totalTripsCompleted}{" "}
                trips
              </div>
            </div>

            <div
              style={{
                padding: "2px 6px",
                borderRadius: 3,
                background: badge.bg,
                color: badge.color,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.07em",
                flexShrink: 0,
              }}
            >
              {badge.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
