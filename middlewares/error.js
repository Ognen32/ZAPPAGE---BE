class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message); // Inherited from the built in error class with the provided message
    this.statusCode = statusCode || 500;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Captures the stack trace for debugging purposes

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error'; // Default error message

// Handles validation errors

  if (err.name === 'ValidationError') {
    err.message = Object.values(err.errors).map(val => val.message).join(', ');
    err.statusCode = 400;
  }

// Handles JWT errors

  if (err.name === 'JsonWebTokenError') {
    err.message = 'Invalid or expired token';
    err.statusCode = 401;
  }

// Handles JWT expires errors

  if (err.name === 'TokenExpiredError') {
    err.message = 'Token expired, please login again';
    err.statusCode = 401;
  }

// For sending an error response to the user

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export { ErrorHandler, errorMiddleware };