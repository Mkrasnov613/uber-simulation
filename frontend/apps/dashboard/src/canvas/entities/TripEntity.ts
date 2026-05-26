import type { Trip, CanvasPoint } from "../../types";
import type { TripStatus } from "../../types/statuses";

export class TripEntity {
  readonly id: string;
  readonly driverId: string;
  readonly passengerId: string;
  status: TripStatus;
  fare: number;

  constructor(dto: Trip) {
    this.id = dto.id;
    this.driverId = dto.driverId;
    this.passengerId = dto.passengerId;
    this.status = dto.status;
    this.fare = dto.fare;
  }

  applyDTO(dto: Trip): void {
    this.status = dto.status;
    this.fare = dto.fare;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    driverPos: CanvasPoint,
    passengerPos: CanvasPoint,
  ): void {
    if (this.status === "COMPLETED" || this.status === "CANCELLED") return;

    ctx.save();

    // glow layer — wide, low opacity, drawn first
    ctx.beginPath();
    ctx.moveTo(driverPos.x, driverPos.y);
    ctx.lineTo(passengerPos.x, passengerPos.y);
    ctx.strokeStyle = "rgba(0,229,192,0.1)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.stroke();

    // main line
    ctx.beginPath();
    ctx.moveTo(driverPos.x, driverPos.y);
    ctx.lineTo(passengerPos.x, passengerPos.y);

    if (this.status === "DRIVER_ARRIVING") {
      // dashed — driver heading to pickup, passenger not yet in car
      ctx.setLineDash([7, 6]);
      ctx.strokeStyle = "rgba(240,165,0,0.7)"; // amber
    } else {
      // solid — driver has the passenger, trip in progress
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(0,229,192,0.75)"; // teal
    }

    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.setLineDash([]); // always reset — dashes leak like shadowBlur

    // midpoint icon — small rotated rect on the line
    const mx = (driverPos.x + passengerPos.x) / 2;
    const my = (driverPos.y + passengerPos.y) / 2;
    const angle = Math.atan2(
      passengerPos.y - driverPos.y,
      passengerPos.x - driverPos.x,
    );

    ctx.translate(mx, my);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.roundRect(-8, -4, 16, 8, 2);
    ctx.fillStyle = "rgba(0,229,192,0.2)";
    ctx.strokeStyle = "rgba(0,229,192,0.5)";
    ctx.lineWidth = 0.8;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
