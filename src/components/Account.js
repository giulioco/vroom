import React from 'react';

import * as db from '../db';
import Setup from './Setup';


export default class Account extends React.Component {

  deleteProfile = () => {
    if (!window.confirm('Are you sure? This will delete your data forever.')) return;

    db.deleteProfile()
    .then(() => this.props.history.push('/'))
    .catch(console.error);
  }

  render() {
    return (
      <>
        <Setup title="Account" {...this.props}/>
        <section className="section" style={{ marginTop: 0 }}>
          <div className="container">
            <article className="message is-danger">
              <div className="message-header">
                <p>Danger Zone</p>
              </div>
              <div className="message-body" style={{ display: 'flex', alignItems: 'center' }}>
                <button className="button is-danger is-outlined" onClick={this.deleteProfile}>Delete Account</button>
                <span className="has-text-dark" style={{ marginLeft: 8 }}>
                  Permanently delete your account and all of your listings
                </span>
              </div>
            </article>
          </div>
        </section>
      </>
    );
  }
}
