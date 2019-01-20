// creates n number of fake listings; only the location is slightly changed

import * as db from './db';
import firebase from 'firebase/app';

export const createData = () => {

  var n = 2

  var latMax = 37
  var latMin = 35
  var longMax = -122
  var longMin = -123

  for (var i = 0; i < n; i++) {

    var randLat = Math.random() * (latMax - latMin) + latMin
    var randLong = Math.random() * (longMax - longMin) + longMin

    var docData = {
      address: i + " street",
      amenities: ["bathroom", "water"],
      description: "this too is a very nice place. pls come here",
      listerID: "TestID" + i,
      location: new firebase.firestore.GeoPoint(randLat, randLong),
      policy: "placeholder",
      rate: 3,
      schedule: "placeholder",
      size: "small"
    };

    db.listings.add(docData);
    console.log("added")


  }
};