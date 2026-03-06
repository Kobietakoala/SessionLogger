# Architecture – Session Logger

## Stack
- Frontend: Vite + React
- Backend: Node.js + Express
- DB: SQLite
- Local dev/prod-like: Docker / docker-compose

## High-level flow
1. Frontend wysyła requesty do backendu (CRUD students/sessions).
2. Backend waliduje input i zapisuje dane w SQLite.
3. Frontend renderuje listy i statystyki na podstawie danych z API.

## Components
- `frontend/` – UI, formularze, widoki
- `backend/` – API + walidacja + DB init
- `backend/db/` – inicjalizacja schematu, ewentualne seedy/migracje
- `docker-compose.yml` – uruchomienie usług lokalnie

## Niefunkcjonalne
- Persistence: SQLite w volume (dane nie znikają po rebuild)
- Observability: /health + logi kontenera
