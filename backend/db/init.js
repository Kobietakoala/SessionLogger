const Database = require('better-sqlite3');
const db = new Database('db/sessionlogger.db', { verbose: console.log });

module.exports = function initDb() {
  console.log('🔨 Inicjalizacja bazy danych...');

  // Tabele students
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS students (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL UNIQUE,
//       code TEXT,
//       class TEXT,
//       phone TEXT,
//       price INTEGER DEFAULT 0,
//       color TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `);

//   // Tabele sessions
//   db.exec(`
//     CREATE TABLE IF NOT EXISTS sessions (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       student_id INTEGER NOT NULL,
//       date DATE NOT NULL,
//       understanding INTEGER CHECK(understanding BETWEEN 1 AND 5),
//       engagement INTEGER CHECK(engagement BETWEEN 1 AND 5),
//       concentration INTEGER CHECK(concentration BETWEEN 1 AND 5),
//       practical INTEGER CHECK(practical BETWEEN 1 AND 5),
//       notes TEXT,
//       timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
//     )
//   `);

//   // Indeksy (szybkość!)
//   db.exec(`
//     CREATE INDEX IF NOT EXISTS idx_sessions_student_date 
//     ON sessions(student_id, date DESC)
//   `);
//   db.exec(`
//     CREATE INDEX IF NOT EXISTS idx_sessions_date 
//     ON sessions(date DESC)
//   `);

  console.log('✅ Schemat bazy gotowy!');
};
