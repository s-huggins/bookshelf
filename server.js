const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('Uncaught exception. Shutting down...');
  process.exit(1);
});

dotenv.config({
  path: path.join(__dirname, 'config', '.env')
});

const PORT = process.env.PORT || 5000;

const app = require('./app');

let server;

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Database connected');
    server = app.listen(PORT, () =>
      console.log(`Listening on port ${PORT}...`)
    );
  });

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection. Shutting down...');
  server.close(() => process.exit(1));
});
