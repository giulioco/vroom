import React from 'react';

import * as db from '../db';

import signinButton from '../images/signin.png';
import landing from '../images/landing.jpg';
import { LazyImg } from './misc';


export default class Home extends React.PureComponent {

  signIn = () => {
    db.signIn()
    .then((path) => this.props.history.push(path))
    .catch(console.error);
  }

  render() {
    return (
      <LazyImg src={landing} style={{ background: '#888888' }} className="home">
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-size-1 has-text-white ">
                vroom
              </h1>
              <h2 className="subtitle is-size-4 has-text-weight-bold has-text-white ">
                A platform for people sleeping in their vehicles to find overnight parking
              </h2>
              <button style={{
                background: `url("${signinButton}")`, backgroundSize: 'cover', width: 196, height: 46, border: 'none',
              }} className="button" onClick={this.signIn} title="Sign In"/>
            </div>
          </div>
        </section>
      </LazyImg>
    );
  }
}
