import { CanvasPoint, Coordinates, MapBounds } from "../../types";

export function project(
  coordinates: Coordinates,
  bounds: MapBounds,
  width: number,
  height: number,
  padding = 50,
): CanvasPoint {
  const x =
    padding +
    ((coordinates.longitude - bounds.minLng) /
      (bounds.maxLng - bounds.minLng)) *
      (width - 2 * padding);

  const y =
    padding +
    ((bounds.maxLat - coordinates.latitude) /
      (bounds.maxLat - bounds.minLat)) *
      (height - 2 * padding);

  return { x, y };
}
