const admin = require('firebase-admin');
// const { deleteCollection } = require('../utils');


admin.initializeApp({
  credential: admin.credential.cert(require('../credentials.json')),
  databaseURL: 'https://vroom-db.firebaseio.com',
});

const firestore = admin.firestore();
const bookings = firestore.collection('bookings');


// This only works because our database is so small
(async () => {

  const snap = await bookings.get();

  const batch = firestore.batch();
  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.booker_id === data.lister_id) {
      batch.delete(doc.ref);
      // console.log(data);
    }
  }

  await batch.commit();

  console.log('Removed duplicates.');

})()
.catch(console.error);
