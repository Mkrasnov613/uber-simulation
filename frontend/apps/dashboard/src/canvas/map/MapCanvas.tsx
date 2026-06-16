import { MutableRefObject, useEffect, useRef } from "react";
import { DriverEntity } from "../entities/DriverEntity";
import { MapBounds, TripStatus } from "../../types";
import { PassengerEntity } from "../entities/PassengerEntity";
import { TripEntity } from "../entities/TripEntity";
import { RoadMap } from "../../types/map";
import { drawRoads } from "./helpers";
import { project } from "../utils/project";
import { TICK_MS } from "../constants";

interface Props {
  bounds: MapBounds;
  roadMap: RoadMap;
  drivers: MutableRefObject<Map<string, DriverEntity>>;
  passengers: MutableRefObject<Map<string, PassengerEntity>>;
  trips: MutableRefObject<Map<string, TripEntity>>;
  tickStart: MutableRefObject<number>;
  smooth?: boolean;
}

export const MapCanvas = ({
  bounds,
  roadMap,
  drivers,
  passengers,
  trips,
  tickStart,
  smooth = true,
}: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useRef({ width: 0, height: 0 });
  const smoothRef = useRef(smooth);
  smoothRef.current = smooth;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      const wrap = wrapRef.current!;
      const w = wrap.clientWidth,
        h = wrap.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size.current = { width: w, height: h };
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);

    let raf = 0;
    function frame(now: number) {
      const alpha = smoothRef.current
        ? Math.min(1, (now - tickStart.current) / TICK_MS)
        : 1;

      ctx.fillStyle = "#0a0e15";
      ctx.fillRect(0, 0, size.current.width, size.current.height);

      drawRoads(ctx, roadMap, bounds, size.current);

      const nodeById = new Map(
        roadMap.nodes.map((node) => [node.id, node] as const),
      );

      for (const trip of trips.current.values()) {
        const driver = drivers.current.get(trip.driverId);
        if (!driver) continue;

        const driverPos = driver.update(alpha);

        // polyline: driver position → currPos (turn anchor) → each remaining waypoint
        // currPos bridges the gap between the interpolated visual position and path[pathIndex]:
        // without it, the line cuts diagonally across roads when pathIndex advances past a turn
        // the driver hasn't visually reached yet.
        const pts = [
          project(driverPos, bounds, size.current.width, size.current.height),
          project(driver.currPos, bounds, size.current.width, size.current.height),
        ];
        for (let i = driver.pathIndex; i < driver.path.length; i++) {
          const node = nodeById.get(driver.path[i]);
          if (node) {
            pts.push(
              project(
                { latitude: node.lat, longitude: node.lng },
                bounds,
                size.current.width,
                size.current.height,
              ),
            );
          }
        }

        if (pts.length >= 2) {
          const inProgress = trip.status === TripStatus.IN_PROGRESS;
          ctx.strokeStyle = inProgress ? "#34d399" : "#f5b13d"; // green on trip, amber to pickup
          ctx.lineWidth = 3;
          ctx.setLineDash(inProgress ? [] : [6, 6]);
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.stroke();
          ctx.setLineDash([]); // reset so it doesn't leak into other strokes
        }
      }

      for (const p of passengers.current.values()) {
        p.draw(ctx, bounds, size.current);
      }

      for (const d of drivers.current.values()) {
        d.draw(ctx, bounds, size.current, alpha);
      }

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [bounds]);

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block" }} />
    </div>
  );
};
