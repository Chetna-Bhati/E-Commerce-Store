const { sendError } = require('../utils/apiResponse');

function errorHandler(err, req, res, next) {
  // Log unexpected server errors
  if (process.env.NODE_ENV !== 'test') {
    console.error('Unhandled Error:', err);
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return sendError(res, 'Validation failed', 400, formattedErrors);
  }

  // Handle MySQL Errors
  if (err.code === 'ER_DUP_ENTRY') {
    return sendError(res, 'Duplicate entry found. Record already exists.', 409);
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return sendError(res, 'Referenced record does not exist.', 400);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired', 401);
  }

  // Custom status code or fallback 500
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return sendError(res, message, statusCode);
}

module.exports = errorHandler;
