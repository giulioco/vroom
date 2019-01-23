const functions = require('firebase-functions');
const admin = require('firebase-admin');

// const { deleteCollection } = require('./utils');


const firestore = admin.firestore();

const users = firestore.collection('users');
// const listings = firestore.collection('listings');

exports.createUser = functions.auth.user().onCreate((user) => {
  console.log(user.displayName, user.email);
  return users.doc(user.uid).set({
    created: admin.firestore.Timestamp.now(),
    name: user.displayName,
    setup: false,
  });
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
  return users.doc(user.uid).delete();
  // .then(() => deleteCollection(listings.where('lister_id', '==', user.uid)));
});
