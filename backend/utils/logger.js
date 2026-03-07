const Database = require('better-sqlite3');
const db = new Database('../db/sessionlogger.db');  

/**
 * Logs to console and database (INFO level)
 * @param {string} message - Message
 * @param {Object} [context={}] - Additional context (e.g. { reqPath: '/api/sessions' })
 */
export const info = (message, context = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[INFO ${timestamp}] ${message}`, context);
  
  const insertLog = db.prepare(`
    INSERT INTO logs (level, message, context, created_at) 
    VALUES (?, ?, ?, ?)
  `);
  insertLog.run('INFO', message, JSON.stringify(context), timestamp);
};

/**
 * Logs errors to console and database (ERROR level)
 * @param {Error|string} error - Error or message
 * @param {string} [context=''] - Additional context (e.g. { reqPath: '/api/sessions' })
 */
export const error = (error, context = '') => {
  const timestamp = new Date().toISOString();
  const msg = error instanceof Error ? error.message : error;
  console.error(`[ERROR ${timestamp}] ${context}: ${msg}`, error.stack);
  
  const insertLog = db.prepare(`
    INSERT INTO logs (level, message, context, created_at) 
    VALUES (?, ?, ?, ?)
  `);
  insertLog.run('ERROR', msg, JSON.stringify({ context, stack: error.stack }), timestamp);
};

/**
 * Retrieves the latest logs (e.g. for /api/logs)
 * @param {number} [limit=50] - Number of logs
 * @returns {Array}
 */
export const getLogs = (limit = 50) => {
  return db.prepare(`
    SELECT * FROM logs ORDER BY created_at DESC LIMIT ?
  `).all(limit);
};

module.exports = { info, error, getLogs };
