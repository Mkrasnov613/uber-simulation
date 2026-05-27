interface Road {
  waypoints: [number, number][]; // [lat, lng] pairs in world space
  width: number; // road width in pixels
  major: boolean; // major roads get dashes + labels
  name?: string;
  curved?: boolean; // use bezier curves between waypoints
}

// A labeled district zone — just text painted on the map
interface District {
  label: string;
  lat: number;
  lng: number;
}

// Real Warsaw roads within 52.15–52.35 / 20.90–21.15
export const ROADS: Road[] = [
  // Major horizontals
  {
    waypoints: [
      [52.23, 20.9],
      [52.23, 21.15],
    ],
    width: 3,
    major: true,
    name: "AL. JEROZOLIMSKIE",
  },
  {
    waypoints: [
      [52.27, 20.9],
      [52.27, 21.15],
    ],
    width: 3,
    major: true,
    name: "UL. MARSZAŁKOWSKA",
  },
  {
    waypoints: [
      [52.19, 20.9],
      [52.19, 21.15],
    ],
    width: 2,
    major: true,
    name: "UL. PUŁAWSKA",
  },
  // Major verticals
  {
    waypoints: [
      [52.15, 21.0],
      [52.35, 21.0],
    ],
    width: 3,
    major: true,
    name: "UL. NOWY ŚWIAT",
  },
  {
    waypoints: [
      [52.15, 21.05],
      [52.35, 21.05],
    ],
    width: 3,
    major: true,
    name: "UL. PRAGA",
  },
  // Minor grid
  {
    waypoints: [
      [52.21, 20.9],
      [52.21, 21.15],
    ],
    width: 1.5,
    major: false,
  },
  {
    waypoints: [
      [52.25, 20.9],
      [52.25, 21.15],
    ],
    width: 1.5,
    major: false,
  },
  {
    waypoints: [
      [52.3, 20.9],
      [52.3, 21.15],
    ],
    width: 1.5,
    major: false,
  },
  {
    waypoints: [
      [52.15, 20.95],
      [52.35, 20.95],
    ],
    width: 1.5,
    major: false,
  },
  {
    waypoints: [
      [52.15, 21.1],
      [52.35, 21.1],
    ],
    width: 1.5,
    major: false,
  },
  // Diagonal - Wisła river approximate path
  {
    waypoints: [
      [52.15, 21.05],
      [52.19, 21.04],
      [52.23, 21.03],
      [52.27, 21.03],
      [52.31, 21.04],
      [52.35, 21.06],
    ],
    width: 4,
    major: false,
    curved: true,
  },
];

export const DISTRICTS: District[] = [
  { label: "ŚRÓDMIEŚCIE", lat: 52.232, lng: 20.96 },
  { label: "WOLA", lat: 52.232, lng: 20.93 },
  { label: "PRAGA", lat: 52.255, lng: 21.075 },
  { label: "MOKOTÓW", lat: 52.19, lng: 21.0 },
  { label: "ŻOLIBORZ", lat: 52.29, lng: 20.97 },
];
