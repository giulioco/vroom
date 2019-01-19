import React from 'react';

import * as db from '../db';


export default class Account extends React.Component {

  render() {
    const user = db.getUser();
    
    return (
      <div className="container">
        <h1 className="is-size-1">Account</h1>
        <pre>{user.displayName}</pre>
      </div>
    );
  }
}
