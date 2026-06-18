import { Coordinates, Driver, DriverStatus, MapBounds } from "../../types";
import { project } from "../utils/project";
import { DRIVER_COLORS } from "../theme";

export class DriverEntity {
  readonly id: string;
  name: string;
  status: DriverStatus;

  prevPos: Coordinates;
  currPos: Coordinates;

  path: string[] = [];
  pathIndex = 0;
  private angle = 0;

  constructor(driver: Driver) {
    this.id = driver.id;
    this.name = driver.name;
    this.status = driver.status;
    this.prevPos = { ...driver.location };
    this.currPos = { ...driver.location };
    this.path = driver.path ?? [];
    this.pathIndex = driver.pathIndex;
  }

  applyDto(driver: Driver, alpha = 1) {
    this.prevPos = this.update(alpha);
    this.currPos = { ...driver.location };
    this.status = driver.status;
    this.path = driver.path ?? [];
    this.pathIndex = driver.pathIndex;
  }

  update(alpha: number): Coordinates {
    return {
      latitude:
        this.prevPos.latitude +
        (this.currPos.latitude - this.prevPos.latitude) * alpha,
      longitude:
        this.prevPos.longitude +
        (this.currPos.longitude - this.prevPos.longitude) * alpha,
    };
  }

  draw(
    ctx: CanvasRenderingContext2D,
    bounds: MapBounds,
    size: { width: number; height: number },
    alpha: number,
  ): void {
    const here = this.update(alpha);
    const { x, y } = project(here, bounds, size.width, size.height);
    const color = DRIVER_COLORS[this.status];

    // keep heading updated only when actually moving
    const p = project(this.prevPos, bounds, size.width, size.height);
    const c = project(this.currPos, bounds, size.width, size.height);
    const dx = c.x - p.x;
    const dy = c.y - p.y;
    if (Math.hypot(dx, dy) > 0.5) {
      // +π/2 because the car sprite faces up (−Y) by default
      this.angle = Math.atan2(dy, dx) + Math.PI / 2;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(this.angle);

    // car body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(-5, -8, 10, 16, 2);
    ctx.fill();

    // windshields
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(-3.5, -6.5, 7, 3.5);
    ctx.fillRect(-3.5, 2.5, 7, 3);

    // wheels
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(-7, -6.5, 2.5, 4);
    ctx.fillRect(4.5, -6.5, 2.5, 4);
    ctx.fillRect(-7, 2.5, 2.5, 4);
    ctx.fillRect(4.5, 2.5, 2.5, 4);

    ctx.restore();
  }
}
