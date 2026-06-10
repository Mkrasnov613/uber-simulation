const API = "http://localhost:8080/api/simulation";

export const post = (path: string) =>
  fetch(`${API}/${path}`, { method: "POST" }).catch(() => {});

export const postJson = (path: string, body: unknown) =>
  fetch(`${API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
