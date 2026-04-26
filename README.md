# Uber Simulation

A full-stack Uber simulation project with a Java backend handling all core logic and calculations, and a React + TypeScript frontend for real-time visualization.

## Architecture

```
uber-simulation/
├── backend/      # Java 21 + Spring Boot + Gradle
└── frontend/     # Turbo monorepo (React + TS dashboard)
```

## Quick Start

### Backend (Docker)

```bash
cd backend

# Build and run with Docker Compose
docker-compose up --build

# Or just build the image
docker build -t uber-sim-backend .
```

The API will be available at `http://localhost:8080`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run all apps in dev mode
npm run dev

# Build all apps
npm run build
```

The dashboard will be available at `http://localhost:5173`.

## Sharing the Backend

Participants can pull and run the backend container without needing Java installed:

```bash
# After publishing to Docker Hub or GHCR:
docker pull <your-username>/uber-sim-backend:latest
docker run -p 8080:8080 uber-sim-backend:latest
```

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Java 21, Spring Boot 3, Gradle      |
| Container | Docker, Docker Compose              |
| Frontend  | React 18, TypeScript, Vite          |
| Monorepo  | Turborepo, npm workspaces           |
