import fs from 'fs';

const Database = require('better-sqlite3');
const db = new Database('db/sessionlogger.db', { verbose: console.log });

module.exports = function initDb() {
  console.log('🔨 Database schema init...');

  // Migration traciking
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Logs
  db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT NOT NULL,  -- INFO, ERROR
      message TEXT NOT NULL,
      context TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('✅ Database schema ready!');
  
  runMigrations();
};

export function runMigrations() {
  console.log('🔨 Migrations started...');

  const files = fs.readdirSync('./db/migrations').sort();
  files.forEach(file => {
    if (!db.prepare(`SELECT 1 FROM migrations WHERE name = ?`).get(file)) {
      db.exec(fs.readFileSync(`./db/migrations/${file}`, 'utf8'));
      db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
    }
  });

  console.log('✅ Database migrations completed!');
}