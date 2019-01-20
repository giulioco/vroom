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

export const Helpers = firebase.firestore;

// Global collections
/** @type firebase.firestore.CollectionReference */
export let users;
/** @type firebase.firestore.CollectionReference */
export let listings;

export const getUser = () => auth.currentUser;

let _userData = null;
export const userData = () => _userData;

const fetchInfo = () => new Promise((resolve) => {
  if (!getUser()) return resolve('/');

  const unsub = users.doc(getUser().uid).onSnapshot((doc) => {
    _userData = doc.data() || {};

    if (!_userData.setup) resolve('/setup');
    else resolve('/dashboard');
  }, () => {
    unsub();
    resolve('/');
  });
});

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

export const authChange = (fn) => auth.onAuthStateChanged(fn);

export const signOut = () => auth.signOut();

export const deleteProfile = () => auth.signInWithPopup(googleProvider)
.then(() => auth.currentUser.delete())
.then(() => auth.signOut())
.then(() => alert('Account successfully deleted'));

export const setupAccount = (data) => users.doc(getUser().uid).set(data);
export const createListing = (data) => db.listings.add(data);


// sortBy can be 'distance' or 'rate'
// export const getListings = (radius, sortBy = 'rate', fn) => {
//   let query = listings.orderBy(sortBy);
//   // listings.where()
//   return query.onSnapshot((snap) => {
//     fn(snap.docs.map((doc) => {
//       const data = doc.data();
//       data.id = doc.id;
//       return data;
//     }));
//   }, () => fn(null));
// };

// export const getListing = (id, fn) => {
//   return listings.doc(id).onSnapshot((doc) => {
//     const data = doc.data();
//     data.id = doc.id;
//     fn(data);
//   }, () => fn(null));
// };
