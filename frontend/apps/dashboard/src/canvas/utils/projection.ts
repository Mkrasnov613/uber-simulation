import { CanvasPoint, Coordinates, MapBounds } from "../../types";

export const project = (
  location: Coordinates,
  bounds: MapBounds,
  w: number,
  h: number,
): CanvasPoint => {
  const x =
    ((location.longitude - bounds.minLng) / (bounds.maxLng - bounds.minLng)) *
    w;
  const y =
    (1 -
      (location.latitude - bounds.minLat) / (bounds.maxLat - bounds.minLat)) *
    h;

  return { x, y };
};
