const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const usersRouter = require('./routes/api/v1/usersRoutes');
const profileRouter = require('./routes/api/v1/profileRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Sets security HTTP headers
app.use(helmet());

/**
 * // limit requests to API
 * const rateLimit = require('express-rate-limit')
 * const limiter = rateLimit({max: 100, windowMs: 60*60*1000, message: "Too many requests from this IP, try again later."})
 * app.use('/api', limiter)
 * TODO: use to limit requests to GR API or to login/subscribe to deflect brute force attacks
 */

// TODO: npm i hpp, app.use(hpp({whitelist:['',...]}))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// body-parser
app.use(express.json({ limit: '10kb' }));

// sanitizes data againt NoSQL query injections
app.use(mongoSanitize());

// sanitizes data against XSS
app.use(xssClean());

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/profile', profileRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// error middleware with 4 params
app.use(globalErrorHandler);

module.exports = app;
