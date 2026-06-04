import { Coordinates, Driver, DriverStatus, MapBounds } from "../../types";
import { project } from "../utils/project";
import { DRIVER_COLORS } from "../utils/theme";

export class DriverEntity {
  readonly id: string;
  name: string;
  status: DriverStatus;

  prevPos: Coordinates;
  currPos: Coordinates;

  constructor(driver: Driver) {
    this.id = driver.id;
    this.name = driver.name;
    this.status = driver.status;
    this.prevPos = { ...driver.location };
    this.currPos = { ...driver.location }; // on first frame prevPos === currPos
  }

  applyDto(driver: Driver) {
    this.prevPos = this.currPos; // last target becomes the new starting point
    this.currPos = { ...driver.location };
    this.status = driver.status;
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
    const position = project(here, bounds, size.width, size.height);

    const color = DRIVER_COLORS[this.status];

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(position.x, position.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
