import { useEffect, useRef, useState } from "react";
import { DriverEntity } from "../canvas/entities/DriverEntity";
import { SimulationState } from "../types";
import { PassengerEntity } from "../canvas/entities/PassengerEntity";
import { TripEntity } from "../canvas/entities/TripEntity";
import { reconcileMap } from "../canvas/utils/reconcileMap";

enum ConnectionStatus {
  CONNECTING = "connecting",
  OPEN = "open",
  CLOSED = "closed",
}

export const useSimulation = ({ url }: { url: string }) => {
  const drivers = useRef(new Map<string, DriverEntity>());
  const passengers = useRef(new Map<string, PassengerEntity>());
  const trips = useRef(new Map<string, TripEntity>());

  const tickStart = useRef(performance.now());

  const [status, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.CONNECTING,
  );
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setStatus(ConnectionStatus.OPEN);
    };
    ws.onclose = () => {
      setStatus(ConnectionStatus.CLOSED);
    };
    ws.onerror = () => {
      setStatus(ConnectionStatus.CLOSED);
    };

    ws.onmessage = (event) => {
      let state: SimulationState;
      try {
        state = JSON.parse(event.data);
      } catch {
        return;
      }
      reconcileMap(drivers.current, state.drivers, (d) => new DriverEntity(d));
      reconcileMap(
        passengers.current,
        state.passengers,
        (p) => new PassengerEntity(p),
      );
      reconcileMap(trips.current, state.activeTrips, (t) => new TripEntity(t));
      tickStart.current = performance.now();
      setTick(state.tick);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { drivers, passengers, trips, tickStart, status, tick };
};
