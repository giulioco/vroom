// creates n number of fake listings; only the location is slightly changed

import * as db from './db';

window.createData = () => {

  const n = 5;

  const latMax = 37;
  const latMin = 35;
  const longMax = -122;
  const longMin = -123;

  for (let i = 100; i < 100 + n; i++) {

    const randLat = Math.random() * (latMax - latMin) + latMin;
    const randLong = Math.random() * (longMax - longMin) + longMin;

    const docData = {
      address: i + " street",
      amenities: ["bathroom", "water"],
      description: "this too is a very nice place. pls come here",
      listerID: "TestID" + i,
      position: db.geo.point(randLat, randLong).data,
      policy: "placeholder",
      rate: 3,
      schedule: "placeholder",
      size: "small",
    };

    db.listings.add(docData);

  }
};
