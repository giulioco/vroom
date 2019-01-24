
const deleteQueryBatch = (query, resolve, reject) => {
  query.get()
  .then((snap) => {
    // When there are no documents left, we are done
    if (!snap.size)
      return true;

    // Delete documents in a batch
    const batch = query.firestore.batch();
    for (const doc of snap.docs) batch.delete(doc.ref);

    return batch.commit()
    .then(() => false);

  })
  .then((done) => {
    if (done) {
      resolve();
      return;
    }

    // Recurse on the next process tick, to avoid exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(query, resolve, reject);
    });
  })
  .catch(reject);
};

// Max docs for batch write is 500
exports.deleteCollection = (collectionRef, batchSize = 300) => new Promise((resolve, reject) => {
  deleteQueryBatch(collectionRef.orderBy('__name__').limit(batchSize), resolve, reject);
});

// This only works if collectionRef has less than 500 docs
exports.updateCollection = async (collectionRef, updateData) => {
  const snap = await collectionRef.get();
  const batch = collectionRef.firestore.batch();

  for (const doc of snap.docs) batch.update(doc.ref, updateData);

  await batch.commit();
};
// updateQueryBatch(collectionRef.orderBy('__name__').limit(batchSize), updateData, batchSize, resolve, reject);
