/* eslint-disable no-use-before-define, no-console, no-plusplus, no-await-in-loop */
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

// if (process.argv[2] === '--run') {
//   runTest(+process.argv[3] || 1);
// } else if (process.argv[2] === '--clean') {
//   cleanupTest();
// } else {
//   console.log('Unrecognized command. Use --run or --clean');
// }

// addCurrentlyReading();

function addCurrentlyReading() {
  try {
    const data = fs.readFileSync(
      path.resolve(__dirname, 'friends-test.json'),
      'utf8'
    );
    const tokens = JSON.parse(data);
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      request.patch({
        url: 'http://localhost:5000/api/v1/profile/bookshelves',
        json: true,
        auth: {
          bearer: token
        },
        body: {
          shelf: 'reading',
          bookId: 377965
        }
      });
    }
  } catch (err) {
    console.log('ERROR IN ADD BOOKS', err);
    process.exit(1);
  }
}

async function runTest(count) {
  let i;
  try {
    for (i = 1; i <= count; i++) {
      const { token, name } = await createAccount(`${i}-test`);
      console.log(`Account ${name} created.`);
      saveToken(token); // synchronous function
      console.log('Token saved.');
      await sendFriendRequest(token);
      console.log('Friend request sent.');
    }
  } catch (err) {
    console.log(`ERROR ON ITERATION ${i}:`, err);
  }
}

function createAccount(name) {
  return request
    .post({
      url: 'http://localhost:5000/api/v1/users/signup',
      json: true,
      body: {
        name,
        email: `${name}@gmail.com`,
        password: '12345678',
        passwordConfirm: '12345678'
      }
    })
    .then(body => {
      if (body.status === 'success') {
        return { token: body.token, name: body.data.user.name };
      }
      throw body;
    });
}

function sendFriendRequest(token) {
  return request
    .post({
      url: 'http://localhost:5000/api/v1/profile/friendRequests/outgoing/2',
      json: true,
      auth: {
        bearer: token
      }
    })
    .then(body => {
      if (body.status === 'success') {
        return body;
      }
      throw body;
    });
}

function saveToken(token) {
  let oldData;

  try {
    oldData = fs.readFileSync(
      path.resolve(__dirname, 'friends-test.json'),
      'utf8'
    );
  } catch (err) {
    oldData = '[]';
  }
  const jsonData = JSON.parse(oldData);
  jsonData.push(token);

  try {
    fs.writeFileSync(
      path.resolve(__dirname, 'friends-test.json'),
      JSON.stringify(jsonData)
    );
  } catch (err) {
    if (err) console.log('ERROR WRITING FILE:', err);
    process.exit(1);
  }
}

function removeAccount(token) {
  request
    .delete({
      url: 'http://localhost:5000/api/v1/users/',
      json: true,
      body: {
        password: '12345678'
      },
      auth: {
        bearer: token
      }
    })
    .then(body => {
      if (body.status === 'success') {
        console.log('Account removed.');
        return body;
      }
      throw body;
    });
}

async function cleanupTest() {
  try {
    const data = fs.readFileSync(
      path.resolve(__dirname, 'friends-test.json'),
      'utf8'
    );
    const tokens = JSON.parse(data);
    // for (let i = 0; i < tokens.length; i++) {
    //   await removeAccount(tokens[i]);
    // }
    const tasks = tokens.map(token => removeAccount(token));
    await Promise.all(tasks);
    // for (let i = 0; i < tokens.length; i++) {
    //   await removeAccount(tokens[i]);
    // }
    fs.unlinkSync(path.resolve(__dirname, 'friends-test.json'));
  } catch (err) {
    console.log('ERROR IN CLEANUP', err);
    process.exit(1);
  }
}
