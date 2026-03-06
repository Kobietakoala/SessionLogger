# PRD Session Logger

## 1. Cel projektu
Session Logger to mała aplikacja dla korepetytora do zapisywania sesji z uczniami i śledzenia postępów.

## 2. Problem
- Zapisy w Word/Excel/Ręcznie w zeszycie są wolne i niespójne.
- Trudno zobaczyć trend postępów ucznia.

## 3. Użytkownicy (Portfolio persona)
- Korepetytor solo (1–20 uczniów).
- Potrzeba: 
    - szybki zapis podsumowania sesji po lekcji (10–30 sekund)
    - szybki zapis informacji podczas trwania sesji

## 4. Zakres MVP
- CRUD uczniów
- Dodawanie i usuwanie sesji
- Historia sesji per uczeń
- Podstawowe statystyki (średnie + trend)

## 5. Non-goals (świadomie nie robimy)
- Logowanie / role użytkowników
- Płatności
- Wysyłka raportów do ucznia (email)
- Aplikacja mobilna natywna

## 6. Kryteria akceptacji (Definition of Done)
- Dodanie sesji nie wymaga więcej niż 5 klików i trwa < 30 sekund.
- Dane nie znikają po restarcie kontenera (SQLite w volume).
- Każdy endpoint zwraca przewidywalne błędy walidacji (400 + payload).

## 7. Ryzyka / ograniczenia
- SQLite (single-writer) – OK dla solo usage.
- Brak auth – aplikacja do użytku własnego.
