// ── Coordinates ───────────────────────────────────────────────────────────────
export interface Coordinates {
  lat: number;
  lng: number;
}

// ── Driver ────────────────────────────────────────────────────────────────────
export type DriverStatus = 'AVAILABLE' | 'EN_ROUTE_TO_PASSENGER' | 'ON_TRIP' | 'OFFLINE';

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  location: Coordinates;
  rating: number;
  currentTripId?: string;
}

// ── Passenger ─────────────────────────────────────────────────────────────────
export type PassengerStatus = 'WAITING' | 'MATCHED' | 'IN_TRIP' | 'COMPLETED';

export interface Passenger {
  id: string;
  name: string;
  status: PassengerStatus;
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  currentTripId?: string;
}

// ── Trip ──────────────────────────────────────────────────────────────────────
export type TripStatus = 'REQUESTED' | 'MATCHED' | 'DRIVER_ARRIVING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Trip {
  id: string;
  driverId: string;
  passengerId: string;
  status: TripStatus;
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  requestedAt: string;    // ISO 8601
  startedAt?: string;
  completedAt?: string;
  fare?: number;
  distanceKm?: number;
  durationSeconds?: number;
}

// ── Simulation State ──────────────────────────────────────────────────────────
export interface SimulationStats {
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  activeDrivers: number;
  availableDrivers: number;
  waitingPassengers: number;
  averageWaitTimeSeconds: number;
  averageTripDurationSeconds: number;
  averageFare: number;
}

export interface SimulationState {
  running: boolean;
  tick: number;
  drivers: Driver[];
  passengers: Passenger[];
  activeTrips: Trip[];
  stats: SimulationStats;
}

// ── API Response wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
}
