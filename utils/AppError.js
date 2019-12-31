class AppError extends Error {
  constructor(message, statusCode, errors) {
    super(message);
    this.msg = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;
    this.isOperational = true; // known error

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
