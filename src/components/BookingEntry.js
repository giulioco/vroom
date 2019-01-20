import React from 'react';

import * as db from '../db';


const Bl = ({ user, listing, dates, title, buttons }) => (
  <div className="box">
    <p className="is-size-3">{title}</p>
    <div className="columns">
      <div className="column is-3 is-mobile">
        <figure className="image is-128x128">
          { listing.image_url && <img src={listing.image_url}/> }
        </figure>
      </div>
      <div className="column is-3 is-mobile">
        {/* <strong>For: </strong> */}
        <p className="has-text-grey">User:</p>
        {user.name}
        <br/><br/>
        <p className="has-text-grey">Booked Dates:</p>
        {dates}
      </div>
      <div className="column is-6 is-mobile">
        <strong>{listing.address}</strong>
        <hr/>
        {listing.listing_name}<br/>
        <p className="has-text-link">{listing.description}</p>
      </div>
    </div>
    <div className="buttons">
      {buttons}
    </div>
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

    db.users.doc(mine ? booker_id : lister_id).get().then((doc) => {
      this.setState({ user: doc.data() });
    }).catch(console.error);

    db.listings.doc(listing_id).get().then((doc) => {

      const listing = doc.data();

      db.listingImages
      .child(listing.listing_img)
      .getDownloadURL()
      .then(image_url => this.setState({ listing: { ...listing, image_url } }));

      this.setState({ listing });
    }).catch(console.error);
  }

  cancel = () => {
    db.listings.doc(this.props.id).update({ status: 'canceled' })
    .catch(console.error);
  }

  accept = () => {
    db.listings.doc(this.props.id).update({ status: 'active' })
    .catch(console.error);
  }

  render() {
    const { status, lister_id, start_date, end_date } = this.props;
    const { user, listing } = this.state;

    const userId = db.getUser().uid;
    const mine = userId === lister_id;

    const range = start_date.toLocaleDateString() + ' - ' + end_date.toLocaleDateString();

    let Inner = null;
    if (!user || !listing) Inner = null;
    else if (status === 'pending' && !mine)
      Inner = (
        <Bl user={user} listing={listing} dates={range} title="Pending Invite" buttons={<>
          <button onClick={this.cancel} className="button is-danger">Cancel</button>
        </>}/>
      );
    else if (status === 'pending' && mine)
      Inner = (
        <Bl user={user} listing={listing} dates={range} title="Pending Invite" buttons={<>
          <button onClick={this.accept} className="button is-danger">Accept</button>
          <button onClick={this.cancel} className="button is-danger">Deny</button>
        </>}/>
      );
    else if (status === 'active')
      Inner = (
        <Bl user={user} listing={listing} dates={range} title="Active Booking" buttons={<>
          <button onClick={this.cancel} className="button is-danger">Cancel</button>
        </>}/>
      );
    else if (status === 'done')
      Inner = (
        <Bl user={user} listing={listing} dates={range} title="Past booking" buttons={null}/>
      );
    return Inner;
  }
}
