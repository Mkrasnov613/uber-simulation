import { Coordinates, MapBounds, Trip, TripStatus } from "../../types";
import { project } from "../utils/project";
import { TRIP_ENROUTE, TRIP_ON_TRIP } from "../theme";

export class TripEntity {
  readonly id: string;
  driverId: string;
  status: TripStatus;
  pickup: Coordinates;
  dropoff: Coordinates;

  constructor(trip: Trip) {
    this.id = trip.id;
    this.driverId = trip.driverId;
    this.status = trip.status;
    this.pickup = { ...trip.pickupLocation };
    this.dropoff = { ...trip.dropoffLocation };
  }

  applyDto(trip: Trip) {
    this.status = trip.status;
    this.pickup = { ...trip.pickupLocation };
    this.dropoff = { ...trip.dropoffLocation };
  }

  draw(
    ctx: CanvasRenderingContext2D,
    bounds: MapBounds,
    size: { width: number; height: number },
    driverPos: Coordinates | null,
  ) {
    if (!driverPos) return;
    const isToPickUp =
      this.status === TripStatus.MATCHED ||
      this.status === TripStatus.DRIVER_ARRIVING;
    const isInProgress = this.status === TripStatus.IN_PROGRESS;

    if (!isToPickUp && !isInProgress) return;

    const target = isInProgress ? this.dropoff : this.pickup;
    const pointA = project(driverPos, bounds, size.width, size.height);
    const pointB = project(target, bounds, size.width, size.height);

    ctx.save();
    ctx.strokeStyle = isInProgress ? TRIP_ON_TRIP : TRIP_ENROUTE;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;
    if (isToPickUp) ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
    ctx.restore();
  }
}
