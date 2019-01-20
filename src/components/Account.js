import React from 'react';

import * as db from '../db';


export default class Account extends React.Component {

  componentDidMount() {
    
  }

  deleteProfile = () => {
    if (!confirm('Are your sure? This will delete you data forever')) return;

    db.deleteProfile()
    .then(() => this.props.history.push('/'))
    .catch(console.error);
  }

  render() {
    const user = db.getUser();
    
    return (
      <div className="container">
        <h1 className="is-size-1">Account</h1>
        <label className="label">Display Name</label>
        <p>{user.displayName}</p>
        <h2 className="is-size-3">History</h2>
        <h2 className="is-size-3">Danger Zone</h2>
        <br/>
        <button onClick={this.deleteProfile} className="button is-danger">Delete your Account</button>
      </div>
    );
  }
}
