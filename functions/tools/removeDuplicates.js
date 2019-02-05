const admin = require('firebase-admin');
// const { deleteCollection } = require('../utils');


admin.initializeApp({
  credential: admin.credential.cert(require('../credentials.json')),
  databaseURL: 'https://vroom-db.firebaseio.com',
});

const firestore = admin.firestore();
const bookings = firestore.collection('bookings');
const listings = firestore.collection('listings');


// This only works because our database is so small
(async () => {

  const snap = await bookings.get();

  const batch = firestore.batch();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (!(await listings.doc(data.listing_id).get()).exists) {
      batch.delete(doc.ref);
    }
  }

  await batch.commit();

  console.log('Removed items.');

})()
.catch(console.error);
