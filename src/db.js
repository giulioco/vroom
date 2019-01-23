import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import * as geofirex from 'geofirex';

import { decodeQuery } from './utils';
import { EventEmitter } from 'events';


firebase.initializeApp({
  apiKey: 'AIzaSyDg2_rQUOaiU3fJlPSOtOEv9cTJkG-aNgE',
  authDomain: 'vroom-db.firebaseapp.com',
  databaseURL: 'https://vroom-db.firebaseio.com',
  projectId: 'vroom-db',
  storageBucket: 'vroom-db.appspot.com',
  messagingSenderId: '67269393820',
});

export const geo = geofirex.init(firebase);


const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();

export const images = storage.ref('user_images');
export const listingImages = storage.ref('listing_images');

export const Helpers = firebase.firestore;

// hacky global start end dates for bookings
// export var bookingStart;
// export var bookingEnd;
export const bookingDates = {
  start: new Date(),
  end: new Date(),
};

// Global collections
/** @type firebase.firestore.CollectionReference */
export let users;
/** @type firebase.firestore.CollectionReference */
export let listings;
/** @type firebase.firestore.CollectionReference */
export let bookings;
/** @type geofirex.GeoFireCollectionRef */
export let geoListings;

export const transaction = (fn) => firestore.runTransaction(fn);

export const getUser = () => auth.currentUser;

// export const userEE = new EventEmitter();


let _userData = null;
export const userData = () => _userData;

const fetchInfo = () => new Promise((resolve) => {
  if (!getUser()) return resolve();

  const unsub = users.doc(getUser().uid).onSnapshot((doc) => {
    _userData = doc.data() || {};

    // userEE.emit('update', _userData);

    resolve();
  }, () => {
    unsub();
    resolve();
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
  bookings = firestore.collection('bookings');
  geoListings = geo.collection('listings');

  return fetchInfo();
});

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signIn = () => auth.signInWithPopup(googleProvider)
.then(() => new Promise(resolve => setTimeout(() => resolve(), 1500)))
.then(() => fetchInfo())
.then(() => {
  if (_userData && !_userData.setup) return '/setup';

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

export const createListing = (data) => listings.add(data);

export const getListings = (lat, long, radius, dates, cb) => {
  const center = geo.point(lat, long);

  return geoListings.within(center, radius, 'position').subscribe((res) => {
    if (!dates) return cb(res);

    const startDate = dates[0].getTime();
    const endDate = dates[1].getTime();
    cb(res.filter((listing) => {
      for (const un of listing.dates_unavailable || []) {
        const time = un.toDate().getTime();
        if (startDate < time && endDate > time) return false;
      }
      return true;
    }));
  }).unsubscribe;
};
