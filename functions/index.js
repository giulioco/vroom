const functions = require('firebase-functions');
const admin = require('firebase-admin');


global.DEV = process.env.NODE_ENV === 'development';
global.config = functions.config();

// Enable database access
admin.initializeApp({
  credential: admin.credential.cert(require('./credentials.json')),
  databaseURL: 'https://vroom-db.firebaseio.com',
});

// Export database triggers
Object.assign(exports, require('./triggers'));
