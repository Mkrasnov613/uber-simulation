const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const wsBase = base.replace(/^http/, "ws"); // http→ws, https→wss

export const API_BASE = `${base}/api`;
export const WS_URL = `${wsBase}/ws/state`;
