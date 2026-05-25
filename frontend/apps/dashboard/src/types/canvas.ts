// Geographic bounding box that defines the visible map area
export interface MapBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

// 2D point in canvas pixel space, produced by projecting lat/lng onto the canvas
export interface CanvasPoint {
  x: number;
  y: number;
}
