import { MapBounds } from "../../types";
import { RoadMap } from "../../types/map";

export function boundsFromMap(map: RoadMap): MapBounds {
  let minLat = Infinity, maxLat = -Infinity;
  let minLng = Infinity, maxLng = -Infinity;
  for (const n of map.nodes) {
    minLat = Math.min(minLat, n.lat);
    maxLat = Math.max(maxLat, n.lat);
    minLng = Math.min(minLng, n.lng);
    maxLng = Math.max(maxLng, n.lng);
  }
  return { minLat, maxLat, minLng, maxLng };
}