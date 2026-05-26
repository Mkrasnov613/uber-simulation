import { DriverStatus, PassengerStatus, TripStatus } from "./statuses";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Driver {
  id: string;
  name: string;
  status: DriverStatus;
  location: Coordinates;
  rating: number;
  totalTripsCompleted: number;
  totalEarnings: number;
  currentTripId?: string | null;
}

export interface Passenger {
  id: string;
  name: string;
  status: PassengerStatus;
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  waitingTicks: number;
  maxWaitTicks: number;
  currentTripId?: string | null;
}

export interface Trip {
  id: string;
  name: string;
  driverId: string;
  passengerId: string;
  status: TripStatus;
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  requestedAtTick: number;
  matchedAtTick: number;
  startedAtTick: number;
  completedAtTick: number;
  fare: number;
  distanceKm: number;
}