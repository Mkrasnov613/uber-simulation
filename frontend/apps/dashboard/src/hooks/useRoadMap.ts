import { useEffect, useState } from "react";
import { RoadMap } from "../types/map";

export const useRoadMap = () => {
  const [map, setMap] = useState<RoadMap | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/map")
      .then((r) => r.json())
      .then(setMap)
      .catch(console.error);
  }, []);

  return map;
};
