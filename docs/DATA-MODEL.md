# DATA MODEL (SQLite)

## 1) Encje i relacje

### Relacje (logiczne)
- `student` 1 — N `contact` (kolumna `contact.student_ulid` wskazuje na `student.ulid`) 
- `student` 1 — N `classDate` (kolumna `classDate.student_ulid` wskazuje na `student.ulid`) 
- `student` 1 — N `note` (kolumna `note.student_ulid` wskazuje na `student.ulid`) 
- `student` 1 — 1 `cooperation` (kolumna `cooperation.student_ulid` jest `UNIQUE NOT NULL`) 

## 2) Tabele i pola

> Konwencja: wszystkie tabele mają `ulid TEXT PRIMARY KEY` oraz flagę `deleted tinyint(1) DEFAULT 0` + `created_at`, `updated_at` 

### 2.1 `student`
- `ulid` TEXT PRIMARY KEY 
- `name` varchar(100) NOT NULL 
- `number` integer (opis: numer zgłoszenia lub generatywny w zależności od typu współpracy) 
- `price` integer (opis: cena zajęć) 
- `rate` tinyint(1) (opis: ocena po pierwszych zajęciach 1–5) 
- `startDate` datetime (opis: data rozpoczęcia zajęć) 
- `deleted` tinyint(1) DEFAULT 0 
- `created_at` timestamp, `updated_at` timestamp 
- Indeksy: `CREATE INDEX ON "student" ("name", "number")` 

### 2.2 `contact` (lista kontaktów)
- `ulid` TEXT PRIMARY KEY 
- `name` VARCHAR(100) NOT NULL 
- `email` VARCHAR(254) UNIQUE (nullable) 
- `phone` VARCHAR(32) 
- `student_ulid` text (FK → `student.ulid`, obecnie nullable) 
- `deleted` tinyint(1) DEFAULT 0 
- `created_at` timestamp, `updated_at` timestamp 
- Indeksy: `CREATE INDEX ON "contact" ("name", "student_ulid")` 

### 2.3 `classDate` (terminy zajęć / sloty)
- `ulid` TEXT PRIMARY KEY 
- `dayOfWeek` tinyint(1) NOT NULL (opis: 1=pon … 7=ndz) 
- `hour` tinyint(2) NOT NULL (opis: godzina zajęć) 
- `isFree` bool NOT NULL DEFAULT 0 (opis: czy godzina dostępna) 
- `repeat` bool DEFAULT 0 (opis: czy termin powtarzalny) 
- `everyDays` tinyint(1) DEFAULT 0 (opis: co ile dni; wartości 0,7,14,21,28) 
- `student_ulid` text (FK → `student.ulid`, obecnie nullable) 
- `deleted` tinyint(1) DEFAULT 0 
- `created_at` timestamp, `updated_at` timestamp 
- Indeksy: `CREATE INDEX ON "classDate" ("student_ulid")` 

### 2.4 `cooperation` (szczegóły współpracy)
- `ulid` TEXT PRIMARY KEY 
- `type` tinyint NOT NULL (opis: 0=private, 1=bukiSchool; może dojść więcej) 
- `paymentType` tinyint NOT NULL (opis: 0=blik, 1=przelew, 2=przelew opóźniony) 
- `boardUrl` text (link do tablicy) 
- `registrationUrl` text (link do zgłoszenia) 
- `student_ulid` text UNIQUE NOT NULL 
- `deleted` tinyint(1) DEFAULT 0 
- `created_at` timestamp, `updated_at` timestamp 
- Indeksy: `CREATE INDEX ON "cooperation" ("student_ulid")` 

### 2.5 `note` (notatki)
- `ulid` TEXT PRIMARY KEY 
- `type` tinyint DEFAULT 0 (opis: 0=notatka, 1=dodatkowa notatka; mogą dojść nowe typy) 
- `note` text 
- `student_ulid` text (FK → `student.ulid`, obecnie nullable) 
- `deleted` tinyint(1) DEFAULT 0 
- `created_at` timestamp, `updated_at` timestamp 
- Indeksy: `CREATE INDEX ON "note" ("type", "student_ulid")` 

## 3) Klucze, indeksy, constraints

### Klucze główne
Każda tabela używa `ulid TEXT PRIMARY KEY` 

### Unikalność (ważne pod walidację API/UI)
- `contact.email` ma constraint `UNIQUE` 
- `cooperation.student_ulid` ma constraint `UNIQUE NOT NULL` (1 rekord współpracy na ucznia) 

### Klucze obce (FK)
- `contact.student_ulid` → `student.ulid` 
- `classDate.student_ulid` → `student.ulid` 
- `note.student_ulid` → `student.ulid` 
- `cooperation.student_ulid` → `student.ulid` 

### Indeksy (pod typowe zapytania)
- `student(name, number)` wspiera wyszukiwanie po nazwie/numerze 
- `contact(name, student_ulid)` wspiera listowanie kontaktów i filtrowanie po uczniu 
- `classDate(student_ulid)` wspiera filtrowanie slotów po uczniu 
- `note(type, student_ulid)` wspiera filtrowanie notatek po uczniu i typie 
- `cooperation(student_ulid)` wspiera szybkie dołączenie współpracy po uczniu 

## 4) Policies (do wdrożenia w API)

### 4.1 ID policy (ULID)
**Propozycja:** generujemy ULID po stronie backendu (lub w shared util) i zapisujemy jako `TEXT`, spójnie dla wszystkich tabel 

**Edge question:** czy ULID ma być case-insensitive (zapis uppercase) i czy walidujemy format na wejściu (np. 26 znaków Crockford)?
~ ulid zawsze uppercase, walidowalny

### 4.2 Timestamp policy (`created_at`, `updated_at`)
W schemacie są pola `created_at` i `updated_at`, ale bez widocznych defaultów/triggerów 

**Propozycja:**
- `created_at` ustawiamy na `CURRENT_TIMESTAMP` przy INSERT.
- `updated_at` ustawiamy na `CURRENT_TIMESTAMP` przy UPDATE (trigger w SQLite albo logika w backendzie).

**Edge question:** czy aktualizujemy `updated_at` także przy soft-delete (zmiana `deleted`)? 
~ tak

### 4.3 Deletion policy (soft delete)
W każdej tabeli istnieje flaga `deleted tinyint(1) DEFAULT 0`, co sugeruje soft delete jako standard 

**Propozycja (spójna dla całej aplikacji):**
- DELETE w API domyślnie = soft delete (`deleted=1`, plus `updated_at`).
- LIST/GET domyślnie filtruje `deleted=0`.
- Opcjonalnie endpoint/admin param `includeDeleted=1` dla debug.

**Edge questions:**
- Usuwam `student` → czy robimy soft-delete kaskadowo na `contact`, `classDate`, `note`, `cooperation`, czy zostawiamy je (zależnie od potrzeb archiwizacji)?
~ Robimy soft-delete
- Czy dopuszczamy „undelete” (przywrócenie) i jak wtedy traktujemy rekordy zależne?
~ Nie dopuszczamy takiej opcji, od tego będzie archiwizacja

### 4.4 Uniqueness policy (email/phone)
`contact.email` jest `UNIQUE`

**Edge questions:**
- Czy na pewno numer telefonu ma być globalnie unikalny (np. rodzeństwo/rodzic jako kontakt dla kilku uczniów)? ~ Nie, zmianiamy koncepcje, telefon nie będzie jednak unikalny [https://github.com/Kobietakoala/SessionLogger/issues/60]
- Jeśli nie: czy zmieniamy constraint na unikalność per uczeń (np. `(student_ulid, phone)`), czy w ogóle zdejmujemy `UNIQUE`? ~ Zdejmujemy unique [https://github.com/Kobietakoala/SessionLogger/issues/60]

### 4.5 Scheduling policy (`classDate`)
`classDate.dayOfWeek` jest opisane jako 1–7, a `everyDays` jako 0/7/14/21/28 

**Edge questions:**
- Czy `hour` to tylko godzina (0–23), czy dopuszczamy półgodziny (wtedy potrzebne `minute` albo `time`)? ~ Dopuszczamy , zmieniamy na time[https://github.com/Kobietakoala/SessionLogger/issues/60]
- Gdy `repeat=0`, czy `everyDays` musi być 0 (walidacja na wejściu)? ~ Tak
- Czy `isFree=1` oznacza „slot do zarezerwowania”, czy „nie ma zajęć” (nazwa vs semantyka)? ~ slot do zarezerowania

### 4.6 Cooperation policy (1–1)
`cooperation.student_ulid` jest `UNIQUE NOT NULL`, co naturalnie pasuje do relacji 1–1 z uczniem 

**Edge question (krytyczne):** czy chcemy, żeby uczeń mógł istnieć bez `cooperation` (np. draft ucznia), czy `cooperation` ma być obowiązkowe od razu? ~ Cooperation nie istnieje bez ucznia, jest to encja istniejącej wspópracy między uczniem, a nauczycielem

## 5) Walidacja danych (minimum dla API)

**Propozycja walidacji wejścia (server-side):**
- `student.name`: wymagane, min 1 znak, max 100 
- `student.rate`: jeśli podane, to 1–5 
- `contact.email`: jeśli podane, format email + max 254 
- `contact.phone`: max 32, normalizacja (usuń spacje) przed zapisem
- `classDate.dayOfWeek`: 1–7 
- ~ `classDate.hour`: 0–23 (jeśli trzymamy „godzina”) ~ Zmiana na `classDate.time`: 00:00 - 23:59
- `cooperation.type`: enum (0/1 na start) 
- `cooperation.paymentType`: enum (0/1/2) 
- `note.type`: enum (0/1 na start) 

---

## Appendix A: „Decisions to resolve” (do odhaczania)

- [x] Odwracamy FK dla `cooperation` (child → parent), czy zostaje jak jest? ~ Tak [issues/59][issues/59]
- [ ] Soft-delete: kaskada vs brak kaskady przy usuwaniu `student` ~ Kaskada [issues/60][issues/60]
- [x] Unikalność `contact.phone`: globalnie vs per uczeń vs brak `UNIQUE` ~ Brak unikalności [issues/60][issues/60]
- [x] Czy `student.name` ma być `NOT NULL` w bazie (i w API), czy dopuszczamy puste? ~ Tak, name jako `not null` [issues/60][issues/60]
- [ ] Jak dokładnie interpretujemy `classDate.isFree` i `repeat/everyDays` w UI - `isFree` - czy termin wolny, `repeat` - czy termin jest powtarzalny, `everyDays` - jeżeli jest powtarzalny, to co jaki czas [issues/60][issues/60]

[issues/59]: https://github.com/Kobietakoala/SessionLogger/issues/59
[issues/60]: https://github.com/Kobietakoala/SessionLogger/issues/60
