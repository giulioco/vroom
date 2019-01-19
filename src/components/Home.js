import React from 'react';

import * as db from '../db';


export default class Home extends React.PureComponent {

  signIn = () => {
    db.signIn()
    .then((path) => this.props.history.push(path))
    .catch(console.error);
  }

  render() {
    return (
      <div className="container">
        <h1 className="is-size-1">Vroom</h1>
        <button onClick={this.signIn} className="button is-primary">Sign In</button>
      </div>
    );
  }
}
