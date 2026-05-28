import { CanvasPoint, DriverStatus, MapBounds } from "../../types";
import { Driver } from "../../types";
import { project } from "../utils/projection";
import { findPath, LatLng } from "../map/RoadGraph";

export class DriverEntity {
  readonly id: string;
  name: string;
  rating: number;
  totalEarnings: number;
  status: DriverStatus;
  totalTripsCompleted: number;
  currentTripId: string | null;

  private pos: CanvasPoint;
  private path: LatLng[] = [];
  private pathIndex: number = 0;
  private geoPos: LatLng;
  private bounds: MapBounds;
  private w: number;
  private h: number;

  constructor(dto: Driver, bounds: MapBounds, w: number, h: number) {
    this.id = dto.id;
    this.name = dto.name;
    this.rating = dto.rating;
    this.totalTripsCompleted = dto.totalTripsCompleted;
    this.totalEarnings = dto.totalEarnings;
    this.currentTripId = dto.currentTripId ?? null;
    this.status = dto.status;
    this.bounds = bounds;
    this.w = w;
    this.h = h;
    this.geoPos = { lat: dto.location.latitude, lng: dto.location.longitude };
    this.pos = { ...project(dto.location, bounds, w, h) };
  }

  update(): void {
    if (this.pathIndex >= this.path.length) return;

    const wp = this.path[this.pathIndex];
    const wpCanvas = project(
      { latitude: wp.lat, longitude: wp.lng },
      this.bounds,
      this.w,
      this.h,
    );

    this.pos.x += (wpCanvas.x - this.pos.x) * 0.09;
    this.pos.y += (wpCanvas.y - this.pos.y) * 0.09;

    const dx = wpCanvas.x - this.pos.x;
    const dy = wpCanvas.y - this.pos.y;
    if (dx * dx + dy * dy < 4) {
      this.geoPos = wp;
      this.pathIndex++;
    }
  }

  applyDTO(dto: Driver, bounds: MapBounds, w: number, h: number): void {
    this.bounds = bounds;
    this.w = w;
    this.h = h;

    const newGeoPos: LatLng = { lat: dto.location.latitude, lng: dto.location.longitude };

    if (newGeoPos.lat !== this.geoPos.lat || newGeoPos.lng !== this.geoPos.lng) {
      this.path = findPath(this.geoPos, newGeoPos);
      this.pathIndex = 0;
    }

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
    ctx.shadowColor = color;
    ctx.shadowBlur = this.status === "OFFLINE" ? 0 : 14;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color + "22";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.shadowBlur = 0;
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
