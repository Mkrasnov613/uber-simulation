import { DriverStatus } from "../types";

export const DRIVER_COLORS: Record<DriverStatus, string> = {
  AVAILABLE: "#56697f", // idle - muted grey
  EN_ROUTE_TO_PASSENGER: "#f5b13d", // amber
  ON_TRIP: "#34d399", // green
  OFFLINE: "#2c3a4d", // barely visible
};

export const PASSENGER_COLOR = "#f5b13d";
export const TRIP_ENROUTE = "#f5b13d";
export const TRIP_ON_TRIP = "#34d399";
