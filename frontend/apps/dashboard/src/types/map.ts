export type RoadNode = { id: string; lat: number; lng: number };
export type RoadEdge = { from: string; to: string };
export type RoadMap = { nodes: RoadNode[]; edges: RoadEdge[] };
