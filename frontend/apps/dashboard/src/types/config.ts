import { QuotaMode } from "./statuses";

export interface SimulationConfig {
  driverCount: number;
  passengerCount: number;
  maxPassengerWaitTicks: number;
  driverSpeedKmPerTick: number;
  quotaMode: QuotaMode;
  quotaTarget: number;
  maxTicks: number;
}
