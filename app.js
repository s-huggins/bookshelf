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
const bookRouter = require('./routes/api/v1/book/bookRoutes');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// app.use((req, res, next) => {
//   console.log(req.method);
//   if(req.method === 'OPTIONS')
//   next();
// });
app.use(helmet());
// app.disable('etag');

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

// app.options('*', cors());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'DELETE, POST, GET, PATCH, OPTIONS'
//   );
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// Sets security HTTP headers

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
app.use('/api/v1/search', searchRouter);
app.use('/api/v1/book', bookRouter);
app.use('/api/v1/author', authorRouter);

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build')); // ???

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
