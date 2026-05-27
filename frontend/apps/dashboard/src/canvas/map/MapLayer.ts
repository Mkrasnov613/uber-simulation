import { MAP_BOUNDS } from "../../constants/mapBounds";
import { project } from "../utils/projection";
import { ROADS } from "./helpers";
import { DISTRICTS } from "./helpers";

export class MapLayer {
  private offscreen: HTMLCanvasElement;
  private offCtx: CanvasRenderingContext2D;
  private dirty = true; // true = needs re-render

  constructor(
    private w: number,
    private h: number,
  ) {
    this.offscreen = document.createElement("canvas");
    this.offscreen.width = w;
    this.offscreen.height = h;
    this.offCtx = this.offscreen.getContext("2d")!;
  }

  // Called every frame by Renderer.
  // If dirty: render the full map to offscreen canvas first.
  // Then blit - drawImage is a single GPU copy, very fast.
  draw(ctx: CanvasRenderingContext2D): void {
    if (this.dirty) {
      this.render();
      this.dirty = false;
    }
    ctx.drawImage(this.offscreen, 0, 0);
  }

  resize(w: number, h: number): void {
    this.w = w;
    this.h = h;
    this.offscreen.width = w;
    this.offscreen.height = h;
    this.dirty = true; // must re-render at new size
  }

  private render(): void {
    const c = this.offCtx;

    this.drawBackground(c);
    this.drawRoads(c);
    this.drawDistrictLabels(c);
  }

  private drawBackground(c: CanvasRenderingContext2D): void {
    // base fill
    c.fillStyle = "#0c0f18";
    c.fillRect(0, 0, this.w, this.h);

    // very subtle grid texture — gives depth to empty blocks
    c.strokeStyle = "rgba(255,255,255,0.012)";
    c.lineWidth = 0.5;
    const step = 40;
    for (let x = 0; x < this.w; x += step) {
      c.beginPath();
      c.moveTo(x, 0);
      c.lineTo(x, this.h);
      c.stroke();
    }
    for (let y = 0; y < this.h; y += step) {
      c.beginPath();
      c.moveTo(0, y);
      c.lineTo(this.w, y);
      c.stroke();
    }
  }

  private drawRoads(c: CanvasRenderingContext2D): void {
    for (const road of ROADS) {
      // project each waypoint from lat/lng to canvas pixels
      const pts = road.waypoints.map(([lat, lng]) =>
        project({ latitude: lat, longitude: lng }, MAP_BOUNDS, this.w, this.h),
      );

      // helper that builds the path — used twice (shadow pass + main pass)
      const makePath = () => {
        c.beginPath();
        c.moveTo(pts[0].x, pts[0].y);

        if (road.curved && pts.length > 2) {
          // bezier curve through waypoints
          // control points are offset toward the previous/next point
          for (let i = 0; i < pts.length - 1; i++) {
            const prev = pts[Math.max(0, i - 1)];
            const curr = pts[i];
            const next = pts[i + 1];
            const after = pts[Math.min(pts.length - 1, i + 2)];

            const cp1x = curr.x + (next.x - prev.x) * 0.18;
            const cp1y = curr.y + (next.y - prev.y) * 0.18;
            const cp2x = next.x - (after.x - curr.x) * 0.18;
            const cp2y = next.y - (after.y - curr.y) * 0.18;

            c.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
          }
        } else {
          for (let i = 1; i < pts.length; i++) {
            c.lineTo(pts[i].x, pts[i].y);
          }
        }
      };

      // pass 1 — dark outer shadow (gives road a raised look)
      makePath();
      c.strokeStyle = "rgba(0,0,0,0.5)";
      c.lineWidth = road.width + 4;
      c.lineCap = "round";
      c.lineJoin = "round";
      c.stroke();

      // pass 2 — road surface
      makePath();
      c.strokeStyle = road.major ? "#131826" : "#101420";
      c.lineWidth = road.width;
      c.stroke();

      // pass 3 — top highlight (thin bright line = 3D bevel effect)
      makePath();
      c.strokeStyle = road.major
        ? "rgba(255,255,255,0.045)"
        : "rgba(255,255,255,0.022)";
      c.lineWidth = road.width * 0.15;
      c.stroke();

      // pass 4 — center dashes on major roads only
      if (road.major) {
        makePath();
        c.strokeStyle = "rgba(255,255,255,0.04)";
        c.lineWidth = 0.8;
        c.setLineDash([8, 10]);
        c.stroke();
        c.setLineDash([]); // always reset
      }

      // road name label — placed at midpoint of the road
      if (road.name) {
        const mid = pts[Math.floor(pts.length / 2)];
        const prev = pts[Math.max(0, Math.floor(pts.length / 2) - 1)];
        const angle = Math.atan2(mid.y - prev.y, mid.x - prev.x);

        c.save();
        c.translate(mid.x, mid.y);
        c.rotate(angle);
        c.font = '500 8.5px "JetBrains Mono", monospace';
        c.fillStyle = "rgba(120,140,180,0.5)";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.letterSpacing = "0.1em";
        c.fillText(road.name, 0, 0);
        c.restore();
      }
    }
  }

  private drawDistrictLabels(c: CanvasRenderingContext2D): void {
    for (const d of DISTRICTS) {
      const pt = project(
        { latitude: d.lat, longitude: d.lng },
        MAP_BOUNDS,
        this.w,
        this.h,
      );

      c.font = '500 11px "JetBrains Mono", monospace';
      c.fillStyle = "rgba(100,120,160,0.4)";
      c.textAlign = "center";
      c.letterSpacing = "0.18em";
      c.fillText(d.label, pt.x, pt.y);
    }
  }
}
