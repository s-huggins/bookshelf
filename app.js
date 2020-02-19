const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const usersRouter = require('./routes/api/v1/users/usersRoutes');
const profileRouter = require('./routes/api/v1/profile/profileRoutes');
const searchRouter = require('./routes/api/v1/search/searchRoutes');
const authorRouter = require('./routes/api/v1/author/authorRoutes');
const messageRouter = require('./routes/api/v1/message/messageRoutes');
const bookRouter = require('./routes/api/v1/book/bookRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

/**
 * // limit requests to API
 * const rateLimit = require('express-rate-limit')
 * const limiter = rateLimit({max: 100, windowMs: 60*60*1000, message: "Too many requests from this IP, try again later."})
 * app.use('/api', limiter)
 * TODO: rate limit requests to login/subscribe to deflect brute force attacks
 */

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
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/book', bookRouter);
app.use('/api/v1/author', authorRouter);
app.use('/api/v1/message', messageRouter);

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404));
  });
}

// error middleware with 4 params
app.use(globalErrorHandler);

module.exports = app;
