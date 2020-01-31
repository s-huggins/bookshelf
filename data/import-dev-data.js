const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({
  path: path.join(__dirname, '../', 'config', '.env')
});

const connection = mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.connection
  .once('open', () => {
    console.log('*** MongoDB connected ***');

    if (process.argv[2] === '--import') {
      importData();
    } else if (process.argv[2] === '--delete') {
      deleteData();
    } else {
      console.log(
        'Unrecognized command. Available options:\n\n--import\timport user data\n--delete\tdrop database'
      );
      process.exit();
    }
  })
  .on('error', err => {
    console.log('*** Connection failed ***', err);
  });

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'user-data.json'), 'utf8')
);

// IMPORT SEED DATA
const importData = async () => {
  try {
    await User.create(users);
    console.log('Data successfully loaded.');
  } catch (err) {
    console.log('IMPORT ERROR:', err);
  }
  process.exit();
};

// DROP DB
const deleteData = async () => {
  try {
    await mongoose.connection.dropDatabase();
    console.log('Database successfully dropped.');
  } catch (err) {
    console.log('DELETION ERROR:', err);
  }
  process.exit();
};
