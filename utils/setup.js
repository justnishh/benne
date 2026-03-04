const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

const email = 'nishantnakum44@gmail.com';
const password = 'Nishant@5454';

const hash = bcrypt.hashSync(password, 10);
const auth = { email, password: hash };

fs.writeFileSync(path.join(dataDir, 'auth.json'), JSON.stringify(auth, null, 2));
console.log('auth.json created successfully');
