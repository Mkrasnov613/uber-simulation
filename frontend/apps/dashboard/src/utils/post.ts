import { API_BASE } from "../config";

const API = `${API_BASE}/simulation`;

export const post = (path: string) =>
  fetch(`${API}/${path}`, { method: "POST" }).catch(() => {});

export const postJson = (path: string, body: unknown) =>
  fetch(`${API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
