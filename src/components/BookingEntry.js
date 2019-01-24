import React from 'react';

import * as db from '../db';
import { LazyImg } from './misc';
import getDates from '../utils'


export const ListingEntry = ({ title = '', listing, user, dates, buttons }) => (
  <div className="box">
    <p className="is-size-3">{title}</p>
    <br/>
    <div className="columns">
      <div className="column is-3 is-mobile">
        <figure className="image" style={{ height: 128 }}>
          <LazyImg src={listing.image_url} style={{ height: '100%', width: '100%' }} placeholder="#eee"/>
        </figure>
      </div>
      { user && (
        <div className="column is-3 is-mobile">
          <p className="has-text-grey">User:</p>
          <a className="link" href={`mailto:${user.email}`}>{user.name}</a>
          <br/><br/>
          <p className="has-text-grey">Requested Dates:</p>
          {dates}
        </div>
      )}
      <div className="column is-6 is-mobile">
        <strong>{listing.address}</strong>
        <hr/>
        {listing.listing_name}<br/>
        <p className="has-text-link">{listing.description}</p>
      </div>
    </div>
    { buttons && (
      <div className="buttons">
        {buttons}
      </div>
    )}
  </div>
);

export default class BookingEntry extends React.Component {

  state = {
    user: null,
    listing: null,
  }

  componentDidMount() {
    const { listing_id, lister_id, booker_id } = this.props;

    const userId = db.getUser().uid;
    const mine = userId === lister_id;

    db.users.doc(mine ? booker_id : lister_id).get()
    .then((doc) => {
      this.setState({ user: doc.data() });
    })
    .catch(console.error);

    db.listings.doc(listing_id).get()
    .then((doc) => {

      const listing = doc.data();

      db.listingImages
      .child(listing.listing_img)
      .getDownloadURL()
      .then(image_url => this.setState({ listing: { ...listing, image_url } }))
      .catch(console.error);

      this.setState({ listing });
    })
    .catch(console.error);
  }

  cancel = () => {
    db.bookings.doc(this.props.id).update({ status: 'canceled' })
    .catch(console.error);
  }

  accept = () => {
    const listing_id = this.props.listing_id
    const start_date = this.props.start_date
    const end_date = this.props.end_date
    db.bookings.doc(this.props.id).update({ status: 'active' }).catch(console.error);
    db.listings.doc(listing_id).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const ref = db.listings.doc(data.listing_id);
        db.transaction((trans) => {
          return trans.get(ref).then((docc) => {
            const data = docc.data();
            const dates_unavailable = data.dates_unavailable || [];
            dates_unavailable = [...dates_unavailable, ...getDates(start_date.toDate(), end_date.toDate())]

            return trans.update(ref, 
              { dates_unavailable: dates_unavailable }
            );
          });
        });
      } 
    })
}

  render() {
    const { status, lister_id, start_date, end_date } = this.props;
    const { user, listing } = this.state;

    const userId = db.getUser().uid;
    const mine = lister_id ? userId === lister_id : true;

    const dates = (start_date && end_date)
      ? start_date.toDate().toLocaleDateString() + ' - ' + end_date.toDate().toLocaleDateString()
      : '';

    let buttons = null;
    let title = '';
    if (status === 'pending' && !mine) {
      title = 'Pending Invite';
      buttons = <button onClick={this.cancel} className="button is-danger">Cancel</button>;
    } else if (status === 'pending' && mine) {
      title = 'Pending Request';
      buttons = <>
        <button onClick={this.accept} className="button is-success">Accept</button>
        <button onClick={this.cancel} className="button is-danger">Deny</button>
      </>;
    } else if (status === 'active') {
      title = 'Active Booking';
      buttons = <button onClick={this.cancel} className="button is-danger">Cancel</button>;
    } else if (status === 'canceled') {
      title = 'Canceled Booking';
    } else if (status === 'done') {
      title = 'Past Booking';
    }

    return (
      <ListingEntry user={user} dates={dates} listing={listing || {}} buttons={buttons} title={title}/>
    );
  }
}
