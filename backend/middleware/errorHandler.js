const { error: logError } = require('../utils/logger.js');

export const notFoundHandler = (req, res, next) => {
  logError('Endpoint not found', req.originalUrl);  // Log 404
  res.status(404).json({ error: 'Endpoint not found' });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  logError(err, `${req.method} ${req.path}`);
  res.status(status).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal error' : err.message 
  });
};
