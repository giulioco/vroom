const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

const users = firestore.collection('users');


exports.createUser = functions.auth.user().onCreate((user) => {
  return users.doc(user.uid).set({
    created: admin.firestore.Timestamp.now(),
    name: user.displayName,
  });
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
  return users.doc(user.uid).delete();
});
