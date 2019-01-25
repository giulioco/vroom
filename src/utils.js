
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
export const getDates = (start, end) => {
  const oneDay = 24*3600*1000;
  for (var d=[],ms=d1*1,last=d2*1;ms<last;ms+=oneDay){
    d.push( new Date(ms) );
  }
  return d;
}
