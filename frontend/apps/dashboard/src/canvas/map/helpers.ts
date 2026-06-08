import { MapBounds } from "../../types";
import { RoadMap } from "../../types/map";
import { project } from "../utils/project";

export function drawRoads(
  ctx: CanvasRenderingContext2D,
  map: RoadMap,
  bounds: MapBounds,
  size: { width: number; height: number },
) {
  // index nodes by id so we can resolve each edge's endpoints
  const byId = new Map(map.nodes.map((n) => [n.id, n] as const));

  // street base — muted lines on the dark canvas
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(120, 144, 190, 0.18)";
  ctx.lineWidth = 9;

  for (const e of map.edges) {
    const a = byId.get(e.from);
    const b = byId.get(e.to);
    if (!a || !b) continue;

    const positionA = project(
      { latitude: a.lat, longitude: a.lng },
      bounds,
      size.width,
      size.height,
    );
    const positionB = project(
      { latitude: b.lat, longitude: b.lng },
      bounds,
      size.width,
      size.height,
    );

    ctx.beginPath();
    ctx.moveTo(positionA.x, positionA.y);
    ctx.lineTo(positionB.x, positionB.y);
    ctx.stroke();
  }

  // intersection dots
  ctx.fillStyle = "rgba(140, 165, 210, 0.35)";
  for (const n of map.nodes) {
    const position = project(
      { latitude: n.lat, longitude: n.lng },
      bounds,
      size.width,
      size.height,
    );
    ctx.beginPath();
    ctx.arc(position.x, position.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
