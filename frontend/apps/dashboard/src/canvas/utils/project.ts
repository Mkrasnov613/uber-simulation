import { CanvasPoint, Coordinates, MapBounds } from "../../types";

export function project(
  coordinates: Coordinates,
  bounds: MapBounds,
  width: number,
  height: number,
): CanvasPoint {
  const x =
    ((coordinates.longitude - bounds.minLng) /
      (bounds.maxLng - bounds.minLng)) *
    width;

  const y =
    ((bounds.maxLat - coordinates.latitude) / (bounds.maxLat - bounds.minLat)) *
    height;
  return { x, y };
}
