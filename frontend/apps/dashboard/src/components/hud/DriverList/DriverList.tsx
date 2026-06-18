import { Driver, DriverStatus, SimulationConfig } from "../../../types";
import { QuotaMode } from "../../../types/statuses";
import {
  DriverInfo,
  DriverMeta,
  DriverName,
  DriverRow,
  IndexBadge,
  ListRoot,
  QuotaProgress,
  StatusBadge,
} from "./DriverList.styled";

interface Props {
  drivers: Driver[];
  config: SimulationConfig | null;
}

const BADGE: Record<DriverStatus, { label: string; color: string; bg: string }> = {
  [DriverStatus.ON_TRIP]: {
    label: "ON TRIP",
    color: "#34d399",
    bg: "rgba(52, 211, 153, 0.1)",
  },
  [DriverStatus.EN_ROUTE_TO_PASSENGER]: {
    label: "PICKUP",
    color: "#f5b13d",
    bg: "rgba(245, 177, 61, 0.1)",
  },
  [DriverStatus.AVAILABLE]: {
    label: "IDLE",
    color: "#7b8fa2",
    bg: "rgba(120, 144, 180, 0.08)",
  },
  [DriverStatus.OFFLINE]: {
    label: "OFFLINE",
    color: "#3d5060",
    bg: "rgba(50, 70, 90, 0.15)",
  },
};

const ORDER: Record<DriverStatus, number> = {
  [DriverStatus.ON_TRIP]: 0,
  [DriverStatus.EN_ROUTE_TO_PASSENGER]: 1,
  [DriverStatus.AVAILABLE]: 2,
  [DriverStatus.OFFLINE]: 3,
};

export const DriverList = ({ drivers, config }: Props) => {
  const sorted = [...drivers].sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const quotaMode = config?.quotaMode ?? null;
  const quotaTarget = config?.quotaTarget ?? 0;

  return (
    <ListRoot>
      {sorted.map((driver, i) => {
        const badge = BADGE[driver.status];
        const parts = driver.name.split(" ");
        const name = parts[0] + (parts[1] ? " " + parts[1][0] + "." : "");

        // RIDES quota is per-driver; EARNINGS quota is fleet-wide — no per-driver target shown
        const ridesMet = quotaMode === QuotaMode.RIDES && driver.totalTripsCompleted >= quotaTarget;

        return (
          <DriverRow key={driver.id}>
            <IndexBadge>{String(i).padStart(2, "0")}</IndexBadge>
            <DriverInfo>
              <DriverName>{name}</DriverName>
              <DriverMeta>
                ★ {driver.rating.toFixed(2)} ·{" "}
                {quotaMode === QuotaMode.RIDES ? (
                  <QuotaProgress $met={ridesMet}>
                    {driver.totalTripsCompleted}/{quotaTarget} trips{ridesMet ? " ✓" : ""}
                  </QuotaProgress>
                ) : (
                  <>{driver.totalTripsCompleted} trips</>
                )}
                {" · "}${driver.totalEarnings.toFixed(0)}
              </DriverMeta>
            </DriverInfo>
            <StatusBadge $color={badge.color} $bg={badge.bg}>
              {badge.label}
            </StatusBadge>
          </DriverRow>
        );
      })}
    </ListRoot>
  );
};
