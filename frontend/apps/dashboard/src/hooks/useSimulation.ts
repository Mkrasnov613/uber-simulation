import { RefObject, useEffect } from "react";
import { Renderer } from "../canvas/Renderer";
import { SimulationState } from "../types";

export const useSimulation = (
  state: SimulationState | null,
  rendererRef: RefObject<Renderer>,
) => {
  useEffect(() => {
    if (!state || !rendererRef.current) return;
    rendererRef.current.update(state);
  }, [state]);

  return state?.stats ?? null;
};
