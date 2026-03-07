import { z } from 'zod';
import * as schemas from './schemas/index.js';

export const validate = (schema, location = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[location]);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.errors
    });
  }
  req.validated = result.data;
  next();
};

export const validateStudent = () => validate(schemas.createStudentSchema);
