import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { RoadMap } from "../types/map";

export const useRoadMap = () => {
  const [map, setMap] = useState<RoadMap | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/map`)
      .then((r) => r.json())
      .then(setMap)
      .catch(console.error);
  }, []);

  return map;
};
