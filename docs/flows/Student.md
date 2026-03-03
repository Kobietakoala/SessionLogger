# User Flows – Session Logger

## Minimalny zestaw (MVP)
1) Dodanie ucznia
2) Dodanie sesji
3) Historia sesji ucznia

---

## 1. Dodanie ucznia
### Cel
Użytkownik dodaje ucznia, żeby logować do niego sesje.

✅ Success:
nowy uczeń pojawia się na liście
zwracane jest id

❌ Error: brak name / brak class / niepoprawny price → pokazujemy błąd walidacji

```mermaid
journey
    title Student – dodaj nowego ucznia
    section Frontend
        Kliknij tab 📊 Uczniowie 1s: 5: Użytkownik
        Kliknij ➕ Nowy uczeń 1s: 5: Użytkownik
        Wpisz name, class 6s: 4: Użytkownik
        Opcjonalnie code, phone 4s: 4: Użytkownik
        Ustaw price 4s: 4: Użytkownik
        Kliknij Zapisz 1s: 5: Użytkownik
    section Backend
        POST /api/students 120ms: 5: System
        Walidacja (Zod) 5ms: 4: System
        DB INSERT students 10ms: 5: System
    section UI
        Toast ✅ zapisano: 5: Użytkownik
        Lista uczniów odświeżona: 5: Użytkownik
```

## 2. Edycja ucznia
### Cel
Użytkownik edytuje ucznia, żeby dane były aktualne

✅ Success:
zakualizowane dane ucznia pojawiają się na liście
zwracane jest id
❌ Error:
id nie istnieje → 404 → UI: „Uczeń nie znaleziony”

```mermaid
journey
  title Student – edycja danych
  section Frontend
    Tab Uczniowie (1s): 5: Użytkownik
    Kliknij ucznia na liście (1s): 5: Użytkownik
    Edytuj pola, np. price (5s): 4: Użytkownik
    Kliknij Zapisz (1s): 5: Użytkownik
  section Backend
    PATCH /api/students/id (120ms): 5: System
    Walidacja (Zod partial) (5ms): 5: System
    DB UPDATE student (10ms): 5: System
  section UI
    Toast zaktualizowano (1s): 5: Użytkownik
    Lista odświeżona (1s): 5: Użytkownik

```

## 3. Usunięcie ucznia
### Cel
Użytkownik usuwa ucznia, aby zakończyć na stałe wspópracę z uczniem

✅ Success:
usunięty uczeń nie pojawia się na liście aktywnych i archiwizowanych uczniów
nic nie jest zwracane
❌ Error:
id nie istnieje → 404 → UI: „Uczeń nie znaleziony”

```mermaid
journey
  title Student – usunięcie
  section Frontend
    Tab Uczniowie -> Archwizowani (1s): 5: Użytkownik
    Kliknij Usuń (1s): 3: Użytkownik
    Potwierdź modal Tak (2s): 4: Użytkownik
  section Backend
    DELETE /api/students/id (120ms): 5: System
    soft-delete student (10ms): 5: System
    Kaskada danych powiązanych (10ms): 3: System
  section UI
    Toast usunięto (1s): 5: Użytkownik
    Lista bez ucznia (1s): 5: Użytkownik

```

## 4. Szczegóły ucznia
### Cel
Użytkownik pobiera informacje o uczniu, aby mieć podgląd na daną osobę

✅ Success:
wyświetla się podgląd ucznia
zwracane są wszystkie dane
❌ Error:
id nie istnieje → 404 → UI: „Uczeń nie znaleziony”

```mermaid
journey
  title Student – szczegóły
  section Frontend
    Tab Uczniowie (1s): 5: Użytkownik
    Kliknij ucznia (1s): 5: Użytkownik
    Widok szczegółów (2s): 5: Użytkownik
  section Backend
    GET /api/students/id (120ms): 5: System
    DB SELECT student (10ms): 5: System
  section UI
    Render danych + akcje (1s): 5: Użytkownik
```

## 6. Archiwizacja ucznia
### Cel
Użytkownik archiwizuje ucznia, aby określic zawieszoną wspópracę

✅ Success:
archiwizowany uczeń nie pojawia się na liście aktywych uczniów
zwracane jest id
❌ Error:
id nie istnieje → 404 → UI: „Uczeń nie znaleziony”

```mermaid
journey
  title Student – archiwizacja
  section Frontend
    Tab Uczniowie (1s): 5: Użytkownik
    Kliknij Archiwizuj (1s): 3: Użytkownik
    Potwierdź modal Tak (2s): 4: Użytkownik
  section Backend
    DB UPDATE /api/students/id/archive (120ms): 5: System
    Kaskada danych powiązanych (10ms): 3: System
  section UI
    Toast archiwizowano (1s): 5: Użytkownik
    Lista archiwizowanych uczniów bez ucznia (1s): 5: Użytkownik
```