const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { deleteCollection, updateCollection } = require('./utils');


const firestore = admin.firestore();

const users = firestore.collection('users');
const listings = firestore.collection('listings');
const bookings = firestore.collection('bookings');

exports.createUser = functions.auth.user().onCreate((user) => {
  return users.doc(user.uid).set({
    created: admin.firestore.Timestamp.now(),
    name: user.displayName,
    setup: false,
  });
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
  return users.doc(user.uid).delete()
  // .then(() => deleteCollection(listings.where('lister_id', '==', user.uid)))
  .then(() => updateCollection(bookings.where('lister_id', '==', user.uid), { status: 'canceled' }))
  .then(() => updateCollection(bookings.where('booker_id', '==', user.uid), { status: 'canceled' }));
});
