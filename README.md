# Uber Simulation

A full-stack Uber ride simulation. The Java backend handles all domain logic — matching, trips, pricing, and simulation state. The React + TypeScript frontend visualizes everything in real time.

## Architecture

```
uber-simulation/
├── backend/      # Java 21 + Spring Boot + Gradle
└── frontend/     # Turbo monorepo (React + TS dashboard)
```

## Quick Start

### Backend (Docker)

Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) first — it lets you start/stop containers, view logs, and rebuild images without using the terminal.

```bash
cd backend

# Build the image
docker build -t uber-sim-backend .

# Start the container
docker-compose up -d
```

The API will be available at `http://localhost:8080`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev

# Production build
npm run build
```

The dashboard will be available at `http://localhost:5173`.

## Sharing the Backend

Participants can run the backend without installing Java — just Docker:

```bash
docker pull <your-username>/uber-sim-backend:latest
docker run -p 8080:8080 uber-sim-backend:latest
```

## Git Workflow

We use a **feature branch strategy** — no one commits directly to `main`. Every change goes through a branch and a Pull Request. This keeps the codebase stable and makes it easy to review each other's work.

### Branch naming

```
feature/matching-algorithm
feature/dashboard-map
fix/driver-location-bug
```

### Step by step

**1. Start from an up-to-date main**

```bash
git checkout main
git pull origin main
```

**2. Create your feature branch**

```bash
git checkout -b feature/your-feature-name
```

**3. Stage and commit your changes locally**

```bash
# Stage everything
git add .

# Or stage a specific file
git add backend/src/main/java/com/ubersim/service/MatchingService.java

# Commit with a descriptive message
git commit -m "feat: add nearest-driver matching algorithm"
```

> Commit message format: `type: short description`
> Common types: `feat`, `fix`, `refactor`, `docs`, `chore`

**4. Push your branch to GitHub**

```bash
git push origin feature/your-feature-name
```

**5. Open a Pull Request**

- Go to the repository on GitHub
- Click **"Compare & pull request"**
- Describe what your PR does and why
- Request a review if needed
- Click **"Create pull request"**

Merge only after approval. Use **Squash and merge** to keep the history clean.

**6. Clean up after merge**

```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
```

### Handy commands

```bash
git status                       # what files have changed
git diff                         # line-by-line diff before staging
git log --oneline -10            # last 10 commits
git stash                        # shelve uncommitted changes temporarily
git stash pop                    # restore stashed changes
git pull origin main --rebase    # sync your branch with latest main
```

### Rules

- Never commit directly to `main`
- Never force push to `main`
- One feature or fix per PR — smaller PRs are easier to review
- Pull from `main` regularly to avoid painful merge conflicts

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Backend   | Java 21, Spring Boot 3, Gradle |
| Container | Docker, Docker Compose         |
| Frontend  | React 18, TypeScript, Vite     |
| Monorepo  | Turborepo, npm workspaces      |

---
---

# Uber Simulation *(Polski)*

Fullstackowa symulacja platformy Uber. Backend w Javie obsługuje całą logikę domenową — dopasowywanie kierowców, przejazdy, ceny i stan symulacji. Frontend w React + TypeScript wizualizuje wszystko w czasie rzeczywistym.

## Architektura

```
uber-simulation/
├── backend/      # Java 21 + Spring Boot + Gradle
└── frontend/     # Turbo monorepo (React + TS dashboard)
```

## Uruchomienie

### Backend (Docker)

Na początku zainstaluj [Docker Desktop](https://www.docker.com/products/docker-desktop/) — pozwala uruchamiać i zatrzymywać kontenery, przeglądać logi oraz przebudowywać obrazy bez użycia terminala.

```bash
cd backend

# Zbuduj obraz
docker build -t uber-sim-backend .

# Uruchom kontener
docker-compose up -d
```

API będzie dostępne pod adresem `http://localhost:8080`.

### Frontend

```bash
cd frontend

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Build produkcyjny
npm run build
```

Dashboard będzie dostępny pod adresem `http://localhost:5173`.

## Udostępnianie backendu

Uczestnicy mogą uruchomić backend bez instalowania Javy — wystarczy Docker:

```bash
docker pull <twoja-nazwa>/uber-sim-backend:latest
docker run -p 8080:8080 uber-sim-backend:latest
```

## Workflow z Gitem

Używamy strategii **feature branch** — nikt nie commituje bezpośrednio do `main`. Każda zmiana przechodzi przez branch i Pull Request. Dzięki temu główna gałąź pozostaje stabilna, a przeglądanie zmian jest proste.

### Nazewnictwo branchy

```
feature/algorytm-dopasowania
feature/mapa-dashboard
fix/blad-lokalizacji-kierowcy
```

### Krok po kroku

**1. Zacznij od aktualnego maina**

```bash
git checkout main
git pull origin main
```

**2. Utwórz swój branch**

```bash
git checkout -b feature/nazwa-funkcji
```

**3. Zapisz zmiany lokalnie**

```bash
# Dodaj wszystkie zmienione pliki
git add .

# Albo konkretny plik
git add backend/src/main/java/com/ubersim/service/MatchingService.java

# Zatwierdź zmiany z opisem
git commit -m "feat: dodaj algorytm dopasowania najblizszego kierowcy"
```

> Format wiadomości commita: `typ: krótki opis`
> Typy: `feat` (nowa funkcja), `fix` (naprawa błędu), `refactor`, `docs`, `chore`

**4. Wypchnij branch na GitHub**

```bash
git push origin feature/nazwa-funkcji
```

**5. Otwórz Pull Request**

- Przejdź do repozytorium na GitHubie
- Kliknij **"Compare & pull request"**
- Opisz co robi PR i dlaczego
- Poproś o review jeśli potrzeba
- Kliknij **"Create pull request"**

Merguj dopiero po zatwierdzeniu. Używaj **Squash and merge**, żeby historia commitów była czytelna.

**6. Posprzątaj po merge'u**

```bash
git checkout main
git pull origin main
git branch -d feature/nazwa-funkcji
```

### Przydatne komendy

```bash
git status                       # jakie pliki zostały zmienione
git diff                         # dokładne różnice przed stagingiem
git log --oneline -10            # ostatnie 10 commitów
git stash                        # tymczasowe odkładanie niezapisanych zmian
git stash pop                    # przywrócenie odłożonych zmian
git pull origin main --rebase    # synchronizacja brancha z aktualnym mainem
```

### Zasady

- Nie commituj bezpośrednio do `main`
- Nie używaj force push na `main`
- Jeden feature lub fix na PR — mniejsze PR są łatwiejsze do przejrzenia
- Regularnie aktualizuj swój branch z `main`, żeby unikać konfliktów
