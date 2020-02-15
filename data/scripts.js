/* eslint-disable no-use-before-define, no-console, no-plusplus, no-await-in-loop */
const fs = require('fs');
const path = require('path');
const request = require('request-promise-native');

// makeFriends(20);
// addCurrentlyReading(34);
// acceptAllFriendRequests();
SendMessagesSync(51);

async function SendMessagesSync(n) {
  await createAccount('1-test');
  await createAccount('2-test');
  await createAccount('3-test');
  const { token } = await signIn('2-test@gmail.com', '12345678');
  const to = [1, 3];
  for (let i = 1; i <= n; i++) {
    await request
      .post({
        url: `http://localhost:5000/api/v1/message`,
        json: true,
        auth: {
          bearer: token
        },
        body: {
          to,
          subject: `lorem ipsum #${i}`,
          body: `${i} - Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure quibusdam tempora eligendi aspernatur atque ipsa voluptatem praesentium libero quisquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure quibusdam tempora eligendi aspernatur atque ipsa voluptatem praesentium libero quisquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure quibusdam tempora eligendi aspernatur atque ipsa voluptatem praesentium libero quisquam?`
        }
      })
      .then(() => console.log(`message #${i} sent`))
      .catch(err => {
        console.log('ERROR SENDING MAIL:', err);
      });
  }
  console.log('messages sent.');
}
async function sendMessagesAsync() {
  await createAccount('1-test');
  await createAccount('2-test');
  const { token } = await signIn('2-test@gmail.com', '12345678');
  const to = [1];
  const mail = [];
  // for (let i = 1; i <= 201; i++) {
  //   if (i !== 2) to.push(i);
  // }
  for (let i = 1; i <= 50; i++) {
    const message = request
      .post({
        url: `http://localhost:5000/api/v1/message`,
        json: true,
        auth: {
          bearer: token
        },
        body: {
          to,
          subject: `lorem ipsum #${i}`,
          body:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure quibusdam tempora eligendi aspernatur atque ipsa voluptatem praesentium libero quisquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure quibusdam tempora eligendi aspernatur atque ipsa voluptatem praesentium libero quisquam? Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias iure quibusdam tempora eligendi aspernatur atque ipsa voluptatem praesentium libero quisquam?'
        }
      })
      .then(() => console.log(`message #${i} sent`));

    mail.push(message);
  }

  await Promise.all(mail)
    .then(() => {
      console.log('messages sent');
    })
    .catch(err => {
      console.log('ERROR SENDING MAIL:', err);
    });
}

function createTestAccount(name) {
  return request.post({
    url: 'http://localhost:5000/api/v1/users/signup',
    json: true,
    body: {
      name,
      email: `${name}@gmail.com`,
      password: '12345678',
      passwordConfirm: '12345678'
    }
  });
}

async function createTestAccounts(count) {
  try {
    const signUpCalls = Array.from({ length: count }).map((_, ix) =>
      createTestAccount(`${ix + 1}-test`)
    );
    await Promise.all(signUpCalls);
    console.log('accounts created');
  } catch (err) {
    console.log(`ERROR SIGNING UP`, err);
  }
}

async function acceptAllFriendRequests() {
  const { token } = await signIn('huggins@tuta.io', '12345678');
  const { profile } = await fetchProfile(token);

  const tasks = profile.friendRequests.map(fReq => {
    if (fReq.kind === 'Received')
      return acceptFriendRequest(token, fReq.profileId);
  });

  await Promise.all(tasks);

  console.log('All friend requests accepted');
}

function acceptFriendRequest(token, profileId) {
  return request
    .post({
      url: `http://localhost:5000/api/v1/profile/friendRequests/incoming/${profileId}`,
      json: true,
      auth: {
        bearer: token
      }
    })
    .then(body => {
      if (body.status === 'success') {
        return console.log(`Accepted friend request of profile ${profileId}`);
      }
      throw body;
    })
    .catch(err => {
      console.log(
        `ERROR ACCEPTING FRIEND REQUEST OF PROFILE ${profileId}`,
        err
      );
      process.exit(1);
    });
}

function signIn(email, password) {
  return request
    .post({
      url: 'http://localhost:5000/api/v1/users/login',
      json: true,
      body: {
        email,
        password
      }
    })
    .then(body => {
      if (body.status === 'success') {
        return { token: body.token };
      }
      throw body;
    })
    .catch(err => {
      console.log('ERROR SIGNING IN', err);
      process.exit(1);
    });
}

function fetchProfile(token) {
  // login

  // send request for profile
  return request
    .get({
      url: 'http://localhost:5000/api/v1/profile',
      json: true,
      auth: {
        bearer: token
      }
    })
    .then(body => {
      if (body.status === 'success') {
        return { token, profile: body.data.profile };
      }
      throw body;
    })
    .catch(err => {
      console.log('ERROR FETCHING PROFILE', err);
      process.exit(1);
    });
}

function addCurrentlyReading(bookId) {
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
          bookId
        }
      });
    }
  } catch (err) {
    console.log('ERROR IN ADD BOOKS', err);
    process.exit(1);
  }
}

async function makeFriends(count) {
  try {
    fs.unlinkSync(path.resolve(__dirname, 'friends-test.json'));
  } catch (err) {
    /* file already cleaned */
  }
  let i;
  try {
    for (i = 1; i <= count; i++) {
      const { token, name } = await createAccount(`test-${i}`);
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
      url: 'http://localhost:5000/api/v1/profile/friendRequests/outgoing/1',
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
