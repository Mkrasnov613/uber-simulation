import {
  Coordinates,
  MapBounds,
  Passenger,
  PassengerStatus,
} from "../../types";
import { project } from "../utils/project";
import { PASSENGER_COLOR } from "../theme";

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
    const { x, y } = project(this.pickup, bounds, size.width, size.height);

    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = PASSENGER_COLOR;
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1.5;

    // body: arch for shoulders + straight sides + flat bottom
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, Math.PI, 0, true);
    ctx.lineTo(5.5, 6);
    ctx.lineTo(-5.5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // head
    ctx.beginPath();
    ctx.arc(0, -5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
