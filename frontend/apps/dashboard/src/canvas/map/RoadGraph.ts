import { ROADS } from "./helpers";

export interface LatLng { lat: number; lng: number }

interface Node { lat: number; lng: number }
interface Edge { to: number; dist: number }

function haversine(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * toRad;
  const dLng = (b.lng - a.lng) * toRad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * toRad) * Math.cos(b.lat * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function segmentIntersect(
  p1: LatLng, p2: LatLng,
  p3: LatLng, p4: LatLng,
): LatLng | null {
  const d1lat = p2.lat - p1.lat, d1lng = p2.lng - p1.lng;
  const d2lat = p4.lat - p3.lat, d2lng = p4.lng - p3.lng;
  const cross = d1lat * d2lng - d1lng * d2lat;
  if (Math.abs(cross) < 1e-12) return null;
  const t = ((p3.lat - p1.lat) * d2lng - (p3.lng - p1.lng) * d2lat) / cross;
  const u = ((p3.lat - p1.lat) * d1lng - (p3.lng - p1.lng) * d1lat) / cross;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { lat: p1.lat + t * d1lat, lng: p1.lng + t * d1lng };
}

function pointOnSegment(p: LatLng, a: LatLng, b: LatLng, tol = 1e-6): boolean {
  const dx = b.lat - a.lat, dy = b.lng - a.lng;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-12)
    return Math.abs(p.lat - a.lat) < tol && Math.abs(p.lng - a.lng) < tol;
  const t = ((p.lat - a.lat) * dx + (p.lng - a.lng) * dy) / len2;
  if (t < -tol || t > 1 + tol) return false;
  return (
    Math.abs(p.lat - (a.lat + t * dx)) < tol &&
    Math.abs(p.lng - (a.lng + t * dy)) < tol
  );
}

function buildGraph(): { nodes: Node[]; adj: Edge[][] } {
  const nodes: Node[] = [];
  const keyMap = new Map<string, number>();

  const addNode = (lat: number, lng: number): number => {
    const key = `${lat.toFixed(7)},${lng.toFixed(7)}`;
    if (keyMap.has(key)) return keyMap.get(key)!;
    const id = nodes.length;
    nodes.push({ lat, lng });
    keyMap.set(key, id);
    return id;
  };

  for (const road of ROADS)
    for (const [lat, lng] of road.waypoints) addNode(lat, lng);

  // Find all road-road intersections and add them as nodes
  for (let i = 0; i < ROADS.length; i++) {
    const wA = ROADS[i].waypoints;
    for (let j = i + 1; j < ROADS.length; j++) {
      const wB = ROADS[j].waypoints;
      for (let si = 0; si < wA.length - 1; si++) {
        for (let sj = 0; sj < wB.length - 1; sj++) {
          const pt = segmentIntersect(
            { lat: wA[si][0], lng: wA[si][1] },
            { lat: wA[si + 1][0], lng: wA[si + 1][1] },
            { lat: wB[sj][0], lng: wB[sj][1] },
            { lat: wB[sj + 1][0], lng: wB[sj + 1][1] },
          );
          if (pt) addNode(pt.lat, pt.lng);
        }
      }
    }
  }

  const adj: Edge[][] = nodes.map(() => []);

  // For each road: collect nodes that lie on it, sort along the road, connect adjacent pairs
  for (const road of ROADS) {
    const segs: [LatLng, LatLng][] = [];
    for (let i = 0; i < road.waypoints.length - 1; i++)
      segs.push([
        { lat: road.waypoints[i][0], lng: road.waypoints[i][1] },
        { lat: road.waypoints[i + 1][0], lng: road.waypoints[i + 1][1] },
      ]);

    const onRoad = nodes.reduce<number[]>((acc, n, id) => {
      if (segs.some(([a, b]) => pointOnSegment(n, a, b))) acc.push(id);
      return acc;
    }, []);

    const origin: LatLng = { lat: road.waypoints[0][0], lng: road.waypoints[0][1] };
    onRoad.sort((a, b) => haversine(origin, nodes[a]) - haversine(origin, nodes[b]));

    for (let i = 0; i < onRoad.length - 1; i++) {
      const a = onRoad[i], b = onRoad[i + 1];
      const dist = haversine(nodes[a], nodes[b]);
      adj[a].push({ to: b, dist });
      adj[b].push({ to: a, dist });
    }
  }

  return { nodes, adj };
}

const GRAPH = buildGraph();

function snapToGraph(pos: LatLng): number {
  let best = 0, bestDist = Infinity;
  for (let i = 0; i < GRAPH.nodes.length; i++) {
    const d = haversine(pos, GRAPH.nodes[i]);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

function aStar(startId: number, goalId: number): number[] {
  const { nodes, adj } = GRAPH;
  const g = new Array<number>(nodes.length).fill(Infinity);
  const parent = new Array<number>(nodes.length).fill(-1);
  g[startId] = 0;

  const open: { id: number; f: number }[] = [
    { id: startId, f: haversine(nodes[startId], nodes[goalId]) },
  ];
  const closed = new Set<number>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const { id: cur } = open.shift()!;
    if (cur === goalId) break;
    if (closed.has(cur)) continue;
    closed.add(cur);

    for (const { to, dist } of adj[cur]) {
      if (closed.has(to)) continue;
      const ng = g[cur] + dist;
      if (ng < g[to]) {
        g[to] = ng;
        parent[to] = cur;
        open.push({ id: to, f: ng + haversine(nodes[to], nodes[goalId]) });
      }
    }
  }

  if (g[goalId] === Infinity) return [startId];

  const path: number[] = [];
  let curr = goalId;
  while (curr !== -1) { path.unshift(curr); curr = parent[curr]; }
  return path;
}

export function findPath(from: LatLng, to: LatLng): LatLng[] {
  if (haversine(from, to) < 0.05) return [to]; // < 50m, skip routing

  const startId = snapToGraph(from);
  const goalId = snapToGraph(to);
  if (startId === goalId) return [to];

  return [...aStar(startId, goalId).map(id => ({ ...GRAPH.nodes[id] })), to];
}
