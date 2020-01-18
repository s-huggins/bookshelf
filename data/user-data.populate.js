const fs = require('fs');
const path = require('path');

const users = [];

for (let i = 0; i < 100; i += 1) {
  const nextUser = {
    name: `stu-${i + 1}`,
    email: `stu-${i + 1}@gmail.com`,
    password: '12345678',
    passwordConfirm: '12345678'
  };
  users.push(nextUser);
}

const userData = JSON.stringify(users);

fs.writeFileSync(path.join(__dirname, 'user-data.json'), userData, 'utf8');
