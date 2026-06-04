import {
  Coordinates,
  MapBounds,
  Passenger,
  PassengerStatus,
} from "../../types";
import { project } from "../utils/project";
import { PASSENGER_COLOR } from "../utils/theme";

export class PassengerEntity {
  readonly id: string;
  status: PassengerStatus;
  pickup: Coordinates;

  constructor(passenger: Passenger) {
    this.id = passenger.id;
    this.status = passenger.status;
    this.pickup = { ...passenger.pickupLocation };
  }

  applyDto(passenger: Passenger) {
    this.status = passenger.status;
    this.pickup = { ...passenger.pickupLocation };
  }

  draw(
    ctx: CanvasRenderingContext2D,
    bounds: MapBounds,
    size: { width: number; height: number },
  ) {
    if (
      this.status !== PassengerStatus.WAITING &&
      this.status !== PassengerStatus.MATCHED
    )
      return;
    const position = project(this.pickup, bounds, size.width, size.height);
    ctx.save();
    ctx.fillStyle = PASSENGER_COLOR;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.stroke();
    ctx.restore();
  }
}
