const express = require('express');
const cors = require('cors');
const path = require('path');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler.js');
const initDb = require('./db/init.js');
// const studentsRouter = require('./routes/students.js');
// const sessionsRouter = require('./routes/sessions.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:80' }));
app.use(express.json());

initDb();

// Routes
// app.use('/api/students', studentsRouter);
// app.use('/api/sessions', sessionsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    db: 'connected' 
  });
});

// logs API
app.get('/api/logs', (req, res) => {
  res.json(getLogs(100));
});


//@todo - dodać tłumaczenia
app.listen(PORT, () => {
  console.log(`The backend runs on http://localhost:${PORT}`);
  // console.log('API: /api/students, /api/sessions');
});
