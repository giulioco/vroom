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

// Takes two dates objects -> returns an array of dates in between
const ONE_DAY = 24 * 3600 * 1000;
export const dateToDay = (date) => {
  let millis;
  if (typeof date === 'number') millis = date;
  else if (date instanceof Date) millis = date.getTime();
  else if (date instanceof firebase.firestore.Timestamp) millis = date.toMillis();
  else millis = Date.now();

  return Math.floor(millis / ONE_DAY);
};
