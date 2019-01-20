// push the listing

import * as db from './db';
import firebase from 'firebase/app';

export const pushListing = (address, lat, long, amenities, description, listerID, policy, rate, schedule, size) => {
  /*
    TYPES IN THE DATABASE
    
    address:      string
    lat:          number
    long:         number
    amenities:    array of strings 
    description:  string
    listerID:     string
    policy:       string
    rate:         number
    schedule:     string
    size:         string
  */

  var Lat = 0
  var Long = 0

  var docData = {
    address: address,
    amenities: amenities,
    description: description,
    listerID: listerID,
    location: new firebase.firestore.GeoPoint(lat, long),
    policy: policy,
    rate: rate,
    schedule: schedule,
    size: size
  };

  db.listings.add(docData);
  console.log("added")
};