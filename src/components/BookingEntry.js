import React from 'react';

import * as db from '../db';
import { LazyImg } from './misc';
import { dateToDay } from '../utils';


export const ListingEntry = ({ title = '', listing, user, dates, buttons, onChat, loadingChat }) => (
  <div className="box">
    <p className="is-size-3">{title}</p>
    <br/>
    <div className="columns">
      <div className="column is-3 is-mobile">
        <LazyImg src={listing.images && listing.images[0]} style={{ height: 128, background: '#eee' }}/>
      </div>
      { user && (
        <div className="column is-3 is-mobile">
          <p className="has-text-grey">User:</p>
          <button className="button is-link is-inverted" disabled={loadingChat}
            onClick={onChat} title={`Live chat with ${user.name}`}>
            {user.name}
          </button>
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

export default class BookingEntry extends React.PureComponent {

  state = {
    user: null,
    listing: null,
    loadingChat: false,
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

      this.setState({ listing });
    })
    .catch(console.error);
  }

  cancel = () => {
    db.bookings.doc(this.props.id).update({ status: 'canceled' })
    .catch(console.error);
  }

  accept = () => {
    const listing_id = this.props.listing_id;
    const start_date = this.props.start_date;
    const end_date = this.props.end_date;

    const ref = db.listings.doc(listing_id);
    db.transaction((trans) => trans.get(ref).then((docc) => {
      const dataa = docc.data();
      
      const dates_unavailable = dataa.dates_unavailable || {};

      const end = dateToDay(end_date);
      for (let day = dateToDay(start_date); day <= end; day++)
        dates_unavailable[day] = true;

      return trans.update(ref, {
        dates_unavailable,
      });
    }))
    .then(() => db.bookings.doc(this.props.id).update({ status: 'active' }))
    .catch(console.error);
  }

  onChat = () => {
    const { lister_id, booker_id } = this.props;

    this.setState({ loadingChat: true });
    
    db.chat.where(`users.${lister_id}`, '==', true).where(`users.${booker_id}`, '==', true)
    .get().then((snap) => {
      if (snap.size > 0)
        this.props.history.push(`/chat/${snap.docs[0].id}`);
      else {
        db.chat.add({
          created: db.Helpers.Timestamp.now(),
          users: {
            [booker_id]: true,
            [lister_id]: true,
          },
        })
        .then((doc) => {
          this.props.history.push(`/chat/${doc.id}`);
        });
      }
    });
  }

  render() {
    const { status, lister_id, start_date, end_date } = this.props;
    const { user, listing, loadingChat } = this.state;

    const userId = db.getUser().uid;
    const mine = lister_id ? userId === lister_id : true;

    const dates = (start_date && end_date)
      ? `${start_date.toDate().toLocaleDateString()} - ${end_date.toDate().toLocaleDateString()}`
      : '';

    let buttons = null;
    let title = '';
    if (status === 'pending' && !mine) {
      title = 'Pending Invite';
      buttons = <button onClick={this.cancel} className="button is-danger">Cancel</button>;
    } else if (status === 'pending' && mine) {
      title = 'Pending Request';
      buttons = (
        <>
          <button onClick={this.accept} className="button is-success">Accept</button>
          <button onClick={this.cancel} className="button is-danger">Deny</button>
        </>
      );
    } else if (status === 'active') {
      title = 'Active Booking';
      buttons = <button onClick={this.cancel} className="button is-danger">Cancel</button>;
    } else if (status === 'canceled') {
      title = 'Canceled Booking';
    } else if (status === 'done') {
      title = 'Past Booking';
    }

    return (
      <ListingEntry user={user} dates={dates} listing={listing || {}}
        buttons={buttons} title={title} onChat={this.onChat} loadingChat={loadingChat}/>
    );
  }
}
