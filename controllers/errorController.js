const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  // dump everything
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.msg,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // trusted error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.msg
    });
  } else {
    // unexpected or unknown error, don't leak to client
    // log somewhere
    res.status(500).json({
      status: 'error',
      message: 'Sorry, something went wrong'
    });
  }
};

const handleJwtError = () =>
  new AppError('Invalid token. Please log in again.', 401, {
    token: 'Invalid token'
  });

const handleJwtExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401, {
    token: 'Token has expired'
  });

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  // console.log('DUPLICATION', err);
  const value = err.errmsg.match(/(['"])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400, { ...err.errors });
};

/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJwtError();
  if (error.name === 'TokenExpiredError') error = handleJwtExpiredError();

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};
