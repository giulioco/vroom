const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

const users = firestore.collection('users');


functions.auth.user().onCreate((user) => {
  return users.doc(user.uid).set({
    created: admin.firestore.Timestamp.now(),
  });
});
