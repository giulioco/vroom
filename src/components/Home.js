import React from 'react';

import * as db from '../db';
import signinButton from '../images/signin.png';


export default class Home extends React.PureComponent {

  signIn = () => {
    db.signIn()
    .then((path) => this.props.history.push(path))
    .catch(console.error);
  }

  render() {
    return (
      <section className="hero is-success is-fullheight" id="landing">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-size-1">
              Vroom
            </h1>
            <h2 className="subtitle is-size-4 has-text-weight-bold">
              A platform for people sleeping in their vehicles to find overnight parking
            </h2>
            <img src={signinButton} width="200" onClick={this.signIn} className="is-clickable"/>
          </div>
        </div>
      </section>
    );
  }
}
