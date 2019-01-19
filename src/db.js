import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { decodeQuery } from './utils';


firebase.initializeApp({
  apiKey: 'AIzaSyDg2_rQUOaiU3fJlPSOtOEv9cTJkG-aNgE',
  authDomain: 'vroom-db.firebaseapp.com',
  databaseURL: 'https://vroom-db.firebaseio.com',
  projectId: 'vroom-db',
  storageBucket: 'vroom-db.appspot.com',
  messagingSenderId: '67269393820',
});


const auth = firebase.auth();
const firestore = firebase.firestore();
// const storage = firebase.storage().ref('/profile_pics');
// storage.child().

// Global collections
/** @type firebase.firestore.CollectionReference */
export let users;
/** @type firebase.firestore.CollectionReference */
export let listings;

export const getUser = () => auth.currentUser;

export let userData = null;

const fetchInfo = () => {
  if (!getUser()) return Promise.resolve();

  return users.doc(getUser().uid).get()
  .then((doc) => {
    userData = doc.data() || {};

    if (!userData.setup) return '/setup';
    else return '/';
  });
};

export const init = () => firestore.enablePersistence()
.catch((err) => {
  if (err.code === 'failed-precondition')
    console.warn('Failed to initialize caching because multiple sessions are open');
  else
    console.error(err);
})
.then(new Promise((resolve) => {
  const unsubscribe = auth.onAuthStateChanged(() => {
    console.log('Signed in:', !!auth.currentUser);
    unsubscribe();
    resolve();
  }, (err) => {
    console.error('Sign in error:', err);
    unsubscribe();
    resolve();
  });
}))
.then(() => {
  users = firestore.collection('users');
  listings = firestore.collection('listings');

  
  return fetchInfo();
});

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signIn = () => auth.signInWithPopup(googleProvider)
.then(() => new Promise(resolve => setTimeout(() => resolve(), 1500)))
.then(() => fetchInfo())
.then((path) => {
  if (path) return path;

  const { from } = decodeQuery(window.location.search);
  if (from && from.startsWith('/')) return from;
  else if (window.location.pathname === '/') return '/dashboard';
  else return window.location.pathname;
});

export const signOut = () => auth.signOut();

export const deleteProfile = () => auth.currentUser.delete()
.then(() => auth.signOut());

export const setupAccount = (data) => users.doc(getUser().uid).set(data);

// sortBy can be 'distance' or 'rate'
export const getListings = (radius, sortBy = 'rate') => {
  let query = listings.orderBy(sortBy);
  // listings.where()
  return query.get().then((snap) => {
    return snap.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
  });
};

export const getListing = (id) => {
  return listings.doc(id).get().then((doc) => {
    const data = doc.data();
    data.id = doc.id;
    return data;
  });
};
