import { SimulationConfig } from "./config";
import { Driver, Passenger, Trip } from "./entities";
import { SimulationStats } from "./stats";
import { SimulationStatus } from "./statuses";

export interface SimulationState {
  status: SimulationStatus;
  running: boolean;
  tick: number;
  config: SimulationConfig;
  drivers: Driver[];
  passengers: Passenger[];
  activeTrips: Trip[];
  stats: SimulationStats;
}

// ── API request / response wrappers ───────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
}
