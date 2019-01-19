import React from 'react';

import * as db from '../db';


export default class Account extends React.Component {

  deleteProfile = () => {
    db.deleteProfile()
    .then(() => this.props.history.push('/'))
    .catch(console.error);
  }

  render() {
    const user = db.getUser();
    
    return (
      <div className="container">
        <h1 className="is-size-1">Account</h1>
        <pre>{user.displayName}</pre>
        <button onClick={this.deleteProfile} className="button is-danger">Delete Profile</button>
      </div>
    );
  }
}
