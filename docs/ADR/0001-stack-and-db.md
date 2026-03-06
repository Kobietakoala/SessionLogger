# ADR 0001 – Stack i baza danych

## Context
Chcę prostą aplikację do użytku własnego, łatwą do uruchomienia lokalnie i bez DevOps.

## Decision
- Frontend: Vite + React
- Backend: Node + Express
- DB: SQLite
- Uruchomienie: docker-compose

## Consequences
+ Minimalny narzut, szybki development, łatwy deploy local.
- SQLite ma ograniczenia concurrency (akceptowalne dla solo usage).
