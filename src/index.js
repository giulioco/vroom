import React from 'react';
import * as ReactDOM from 'react-dom';
import * as Offline from 'offline-plugin/runtime';

import './styles/index.scss';
import App from './components/App';
import * as db from './db';
import './createData';



if (process.env.NODE_ENV === 'production') {
  Offline.install({
    onUpdateReady: () => Offline.applyUpdate(),
    onUpdated: () => { window.swUpdate = true; },
  });
} else if (process.env.NODE_ENV === 'development') {
  window.db = db;
}

db.init()
.then((path) => {
  ReactDOM.render(<App path={path} />, document.getElementById('root'));
});
