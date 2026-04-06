/**
 * Global Error Handling Middleware
 * This must be the LAST middleware
 */

const errorHandler = (err, req, res, next) => {
  // Default values
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Mongoose: Invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose: Duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  // Mongoose: Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/* ✅ ES MODULE EXPORT (FINAL FIX) */
export default errorHandler;
