
const deleteQueryBatch = (query, batchSize, resolve, reject) => {
  query.get()
  .then((snap) => {
    // When there are no documents left, we are done
    if (!snap.size)
      return 0;

    // Delete documents in a batch
    const batch = query.firestore.batch();
    for (const doc of snap.docs) batch.delete(doc.ref);

    return batch.commit()
    .then(() => snap.size);

  })
  .then((numDeleted) => {
    if (numDeleted === 0) {
      resolve();
      return;
    }

    // Recurse on the next process tick, to avoid exploding the stack.
    process.nextTick(() => {
      deleteQueryBatch(query, batchSize, resolve, reject);
    });
  })
  .catch(reject);
};

// Max docs for batch write is 500
exports.deleteCollection = (collectionRef, batchSize = 300) => new Promise((resolve, reject) => {
  deleteQueryBatch(collectionRef.orderBy('__name__').limit(batchSize), batchSize, resolve, reject);
});
