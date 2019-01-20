import React from 'react';

import * as db from '../db';
import BookingEntry from './BookingEntry';


export default class Dashboard extends React.Component {

  state = {
    mine: null,
    theirs: null,
  }

  componentDidMount() {

    this.unsubscribe1 = db.bookings.where('lister_id', '==', db.getUser().uid).onSnapshot((snap) => {
      const mine = snap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      this.setState({ mine });
    });

    this.unsubscribe2 = db.bookings.where('booker_id', '==', db.getUser().uid).onSnapshot((snap) => {
      const theirs = snap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      this.setState({ theirs });
    });

  }

  componentWillUnmount() {
    this.unsubscribe1();
    this.unsubscribe2();
  }

  render() {
    const { mine, theirs } = this.state;

    return (
      <div className="container">
        <br/>
        <h1 className="is-size-1">Dashboard</h1>
        
        { mine && mine.length ? <>
          <hr/>
          <h2 className="is-size-2">My Listings</h2>
          {mine.map((entry) => <BookingEntry {...entry} key={entry.id}/>)}
        </> : null}
        
        { theirs && theirs.length ? <>
          <hr/>
          <h2 className="is-size-2">My Bookings</h2>
          {theirs.map((entry) => <BookingEntry {...entry} key={entry.id}/>)}
        </> : null}

        { (!mine || !mine.length) && (!theirs || !theirs.length) && (
          <p className="is-size-3 has-text-link"><br/>No booked times yet!</p>
        )}

      </div>
    );
  }

}
