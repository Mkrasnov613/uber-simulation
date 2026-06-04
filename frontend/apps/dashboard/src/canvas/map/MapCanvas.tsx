import { MutableRefObject, useEffect, useRef } from "react";
import { DriverEntity } from "../entities/DriverEntity"; // adjust to your path
import { MapBounds } from "../../types";
import { PassengerEntity } from "../entities/PassengerEntity";
import { TripEntity } from "../entities/TripEntity";

const TICK_MS = 700; // how often a backend tick arrives

interface Props {
  bounds: MapBounds;
  drivers: MutableRefObject<Map<string, DriverEntity>>;
  passengers: MutableRefObject<Map<string, PassengerEntity>>;
  trips: MutableRefObject<Map<string, TripEntity>>;
  tickStart: MutableRefObject<number>;
}

export const MapCanvas = ({
  bounds,
  drivers,
  passengers,
  trips,
  tickStart,
}: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const size = useRef({ width: 0, height: 0 });

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
      canvas.style.width = `${w}px`; // CSS box = logical pixels
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // now 1 unit = 1 CSS pixel
      size.current = { width: w, height: h };
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);

    let raf = 0;
    function frame(now: number) {
      // how far through the current tick? (0 - 1)
      const alpha = Math.min(1, (now - tickStart.current) / TICK_MS);

      // canvas never auto-clears — wipe first or you get trails
      ctx.fillStyle = "#0a0e15";
      ctx.fillRect(0, 0, size.current.width, size.current.height);

      for (const trip of trips.current.values()) {
        const driver = drivers.current.get(trip.driverId);
        const driverPos = driver ? driver.update(alpha) : null;
        trip.draw(ctx, bounds, size.current, driverPos);
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

    // stop the loop when the component unmounts
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
