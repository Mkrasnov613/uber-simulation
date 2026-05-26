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
  totalEarnings: number;
}
