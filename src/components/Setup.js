import React from 'react';

import * as db from '../db';


export default class Setup extends React.Component {

  pushUserInfo = () => {
    const userData = db.userData;

  }

  render() {
    const user = db.getUser();
    
    return (
      <div className="container">
        <h1 className="is-size-1">Account</h1>
        <pre>{user.displayName}</pre>
        <button onClick={this.deleteProfile} className="button is-primary">Setup</button>
      </div>
    );
  }
}
