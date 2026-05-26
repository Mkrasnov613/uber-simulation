import type { Passenger, MapBounds, CanvasPoint } from "../../types";
import type { PassengerStatus } from "../../types/statuses";
import { project } from "../utils/projection";

export class PassengerEntity {
  readonly id: string;
  name: string;
  status: PassengerStatus;
  currentTripId: string | null;
  waitingTicks: number;

  private pickupPos: CanvasPoint; // where passenger stands
  private dropoffPos: CanvasPoint; // destination — shown as a marker
  private phase: number; // random 0–2π, offsets the pulse timing

  constructor(dto: Passenger, bounds: MapBounds, w: number, h: number) {
    this.id = dto.id;
    this.name = dto.name;
    this.status = dto.status;
    this.currentTripId = dto.currentTripId ?? null;
    this.waitingTicks = dto.waitingTicks;

    this.pickupPos = project(dto.pickupLocation, bounds, w, h);
    this.dropoffPos = project(dto.dropoffLocation, bounds, w, h);

    this.phase = Math.random() * Math.PI * 2;
  }

  applyDTO(dto: Passenger, bounds: MapBounds, w: number, h: number): void {
    this.status = dto.status;
    this.currentTripId = dto.currentTripId ?? null;
    this.waitingTicks = dto.waitingTicks;
  }

  draw(ctx: CanvasRenderingContext2D, timestamp: number): void {
    // COMPLETED and ABANDONED passengers don't need to be drawn
    if (this.status === "COMPLETED" || this.status === "ABANDONED") return;

    const { x, y } = this.pickupPos;
    const color = this.colorForStatus();

    ctx.save();

    // pulse ring — only for WAITING passengers
    if (this.status === "WAITING") {
      // Math.sin oscillates between -1 and +1
      // multiply timestamp by small number to control speed
      const pulse = Math.sin(timestamp * 0.003 + this.phase);
      const outerRadius = 10 + pulse * 4; // oscillates between 6 and 14

      ctx.beginPath();
      ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.25 + pulse * 0.15; // fades in and out too
      ctx.stroke();
      ctx.globalAlpha = 1; // always reset globalAlpha
    }

    // diamond shape — visually distinct from driver circles
    // technique: translate to center, rotate 45°, draw a square
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.rect(-5, -5, 10, 10);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore(); // restore undoes translate + rotate
  }

  // TripEntity needs to draw a line to the dropoff
  getPickupPos(): CanvasPoint {
    return { ...this.pickupPos };
  }
  getDropoffPos(): CanvasPoint {
    return { ...this.dropoffPos };
  }

  private colorForStatus(): string {
    const colors: Record<PassengerStatus, string> = {
      WAITING: "#8b5cf6", 
      MATCHED: "#f0a500", 
      IN_TRIP: "#00e5c0", 
      COMPLETED: "#1e2535",
      ABANDONED: "#ef4444",
    };
    return colors[this.status];
  }
}
