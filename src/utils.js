import firebase from 'firebase/app';


// check if object is empty
export const isEmpty = (obj) => {
  for (const _ in obj) return false;
  return true;
};

export const encodeQuery = (obj) => {
  const str = [];
  for (const key in obj) {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  }
  return str.join('&');
};

export const decodeQuery = (str) => {
  if (str.startsWith('?')) str = str.substr(1);

  let match;
  const search = /([^&=]+)=?([^&]*)/g;

  const obj = {};
  while (match = search.exec(str)) {
    obj[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
  }

  return obj;
};

// Get days since epoch
export const dateToDay = (date) => {
  if (date instanceof firebase.firestore.Timestamp) date = date.toDate();
  date.setHours(12, 0, 0, 0);
  return Math.floor(date / 86400000);
};

const toRad = (v) => v * Math.PI / 180;
export const distPoints = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};
