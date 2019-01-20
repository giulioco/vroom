import React from 'react';
import * as ReactDOM from 'react-dom';
import * as Offline from 'offline-plugin/runtime';

import './styles/index.scss';
import App from './components/App';
import * as db from './db';
import * as cd from './createData';


if (process.env.NODE_ENV === 'production') {
  Offline.install({
    onUpdateReady: () => Offline.applyUpdate(),
    onUpdated: () => { window.swUpdate = true; },
  });
} else if (process.env.NODE_ENV === 'development') {
  window.db = db;
  window.createData = cd;
}

db.init()
  .then(() => {
    ReactDOM.render(<App />, document.getElementById('root'));
  });
