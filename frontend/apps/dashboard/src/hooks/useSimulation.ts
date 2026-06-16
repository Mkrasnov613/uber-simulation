import { useEffect, useRef, useState } from "react";
import { DriverEntity } from "../canvas/entities/DriverEntity";
import {
  Driver,
  SimulationConfig,
  SimulationState,
  SimulationStats,
} from "../types";
import { PassengerEntity } from "../canvas/entities/PassengerEntity";
import { TripEntity } from "../canvas/entities/TripEntity";
import { reconcileMap } from "../canvas/utils/reconcileMap";
import { SimulationStatus } from "../types/statuses";
import { TICK_MS } from "../canvas/constants";

export type WsStatus = "connecting" | "open" | "closed";

export const useSimulation = ({ url }: { url: string }) => {
  const drivers = useRef(new Map<string, DriverEntity>());
  const passengers = useRef(new Map<string, PassengerEntity>());
  const trips = useRef(new Map<string, TripEntity>());

  const tickStart = useRef(performance.now());

  const [status, setStatus] = useState<WsStatus>("connecting");
  const [simStatus, setSimStatus] = useState<SimulationStatus>(
    SimulationStatus.IDLE,
  );
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState<number>(0);
  const [config, setConfig] = useState<SimulationConfig | null>(null);
  const [stats, setStats] = useState<SimulationStats | null>(null);
  const [driverList, setDriverList] = useState<Driver[]>([]);
  const [activeTripsCount, setActiveTripsCount] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => setStatus("open");
    ws.onclose = () => setStatus("closed");
    ws.onerror = () => setStatus("closed");

    ws.onmessage = (event) => {
      let state: SimulationState;
      try {
        state = JSON.parse(event.data);
      } catch {
        return;
      }

      const alpha = Math.min(
        1,
        (performance.now() - tickStart.current) / TICK_MS,
      );

      const seenDrivers = new Set<string>();

      for (const dto of state.drivers) {
        seenDrivers.add(dto.id);
        const existing = drivers.current.get(dto.id);
        if (existing) existing.applyDto(dto, alpha);
        else drivers.current.set(dto.id, new DriverEntity(dto));
      }

      for (const id of drivers.current.keys())
        if (!seenDrivers.has(id)) drivers.current.delete(id);

      reconcileMap(
        passengers.current,
        state.passengers,
        (p) => new PassengerEntity(p),
      );

      reconcileMap(trips.current, state.activeTrips, (t) => new TripEntity(t));

      tickStart.current = performance.now();

      setSimStatus(state.status ?? SimulationStatus.IDLE);
      setRunning(state.running);
      setTick(state.tick);
      setConfig(state.config);
      setStats(state.stats);
      setDriverList(state.drivers);
      setActiveTripsCount(state.activeTrips.length);
    };

    return () => ws.close();
  }, [url]);

  return {
    drivers,
    passengers,
    trips,
    tickStart,
    status,
    simStatus,
    running,
    tick,
    config,
    stats,
    driverList,
    activeTripsCount,
  };
};
