import { CanvasPoint, DriverStatus, MapBounds } from "../../types";
import { Driver } from "../../types";
import { project } from "../utils/projection";

export class DriverEntity {
  readonly id: string;
  name: string;
  rating: number;
  totalEarnings: number;
  status: DriverStatus;
  totalTripsCompleted: number;
  currentTripId: string | null;

  private pos: CanvasPoint;
  private target: CanvasPoint;

  constructor(dto: Driver, bounds: MapBounds, w: number, h: number) {
    this.id = dto.id;
    this.name = dto.name;
    this.rating = dto.rating;
    this.totalTripsCompleted = dto.totalTripsCompleted;
    this.totalEarnings = dto.totalEarnings;
    this.currentTripId = dto.currentTripId ?? null;
    this.status = dto.status;

    // Project the real lat/lng position onto canvas pixels
    const point: CanvasPoint = project(dto.location, bounds, w, h);

    // On creation: pos and target are the SAME point.
    // This means the driver appears instantly at its real location
    // instead of lerping in from (0, 0).
    this.pos = { ...point };
    this.target = { ...point };
  }

  update(): void {
    // Lerp formula: move pos 9% closer to target each frame
    // At 60fps this feels smooth
    this.pos.x += (this.target.x - this.pos.x) * 0.09;
    this.pos.y += (this.target.y - this.pos.y) * 0.09;
  }

  // Called when WebSocket/polling sends new state
  applyDTO(dto: Driver, bounds: MapBounds, w: number, h: number): void {
    // Project new lat/lng to canvas pixels — becomes the new TARGET.
    this.target = project(dto.location, bounds, w, h);

    this.status = dto.status;
    this.currentTripId = dto.currentTripId ?? null;
    this.totalTripsCompleted = dto.totalTripsCompleted;
    this.totalEarnings = dto.totalEarnings;
    this.rating = dto.rating;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const { x, y } = this.pos;
    const color = this.colorForStatus();

    ctx.save();
    // shadowBlur creates the glow — only for active drivers
    ctx.shadowColor = color;
    ctx.shadowBlur = this.status === "OFFLINE" ? 0 : 14;

    // Outer glow ring — low opacity filled circle
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color + "22"; // hex opacity: 22 = ~13%
    ctx.fill();

    // Pin body — the visible dot
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // White border — makes it readable on dark map
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.shadowBlur = 0; // always reset — shadowBlur bleeds into other draws
    ctx.restore();
  }

  getPos(): CanvasPoint {
    return { ...this.pos };
  }

  private colorForStatus(): string {
    const colors: Record<DriverStatus, string> = {
      AVAILABLE: "#4a5568",
      EN_ROUTE_TO_PASSENGER: "#f0a500",
      ON_TRIP: "#00e5c0",
      OFFLINE: "#1e2535",
    };
    return colors[this.status];
  }
}
