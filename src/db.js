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


// Global collections
/** @type firebase.firestore.CollectionReference */
export let users;

export const getUser = () => auth.currentUser;


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
});

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signIn = () => auth.signInWithPopup(googleProvider)
.then(() => {
  const { from } = decodeQuery(window.location.search);
  if (from && from.startsWith('/')) return from;
  else if (window.location.pathname === '/') return '/account';
  else return window.location.pathname;
});

export const signOut = () => auth.signOut();

export const deleteProfile = () => {
  const userId = getUser().id;
  return users.doc(userId).delete();
};
