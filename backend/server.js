const express = require('express');
const cors = require('cors');
const path = require('path');

// Init DB + routes (modularnie)
const initDb = require('./db/init.js');
// const studentsRouter = require('./routes/students.js');
// const sessionsRouter = require('./routes/sessions.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:80' }));
app.use(express.json());

// Init baza (schemat + seed)
initDb();

// Routes
// app.use('/api/students', studentsRouter);
// app.use('/api/sessions', sessionsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    db: 'connected' 
  });
});

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
  // console.log('API: /api/students, /api/sessions');
});
