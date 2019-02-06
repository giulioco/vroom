import React from 'react';
import Calender from 'react-calendar';

import * as db from '../db';
import { LazyImg } from './misc';
import { dateToDay } from '../utils';


export default class ViewListing extends React.Component {

  state = {
    data: null,
    dates: null,
  }

  componentDidMount() {
    this.id = this.props.match.params.id;

    this.setState({
      dates: [db.bookingDates.start, db.bookingDates.end],
    });


    db.listings.doc(this.id).get().then((doc) => {
      if (!doc.exists) {
        this.setState({ data: false });
        return;
      }

      const data = doc.data();


      // amenities is stored as a map,
      // find the amenities the listing has,
      // make it into a string that can be displayed
      const amenitiesArray = [];
      const keys = Object.keys(data.amenities);
      for (const key of keys) {
        if (data.amenities[key]) {
          amenitiesArray.push(key);
        }
      }
      data.amenities = amenitiesArray.join(', ');

      // find the poster using the id
      db.users.doc(data.lister_id).get().then((user) => {
        const userData = user.data();
        if (user.exists) {
          data.poster = userData.name;
        } else {
          data.poster = 'A Vroomer';
        }

        this.setState({ data });
      });
    });
  }

  createBooking = () => {
    const listing = this.state.data;
    const listing_id = this.props.match.params.id;
    const booker_id = db.getUser().uid;

    const bookingData = {
      lister_id: listing.lister_id,
      booker_id,
      start_date: this.state.dates[0],
      end_date: this.state.dates[1],
      status: 'pending',
      listing_id,
      created: db.Helpers.Timestamp.now(),
    };

    db.bookings.add(bookingData)
    .then(() => this.props.history.push('/dashboard/requests'));
  }


  deleteListing = () => {
    const listing_id = this.props.match.params.id;

    if (!window.confirm('Are you sure? This will delete your listing forever.')) return;
    db.listings.doc(listing_id).delete().then(() => this.props.history.push('/listings'));
  }

  onChange = (dates) => {
    this.setState({ dates });
  }

  render() {
    const { data, dates } = this.state;

    if (data === false) throw { code: 404 };

    const {
      amenities, description, policy, rate, size, listing_name, poster, lister_id, dates_unavailable, images,
    } = data || {};

    return (
      <div>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {listing_name}
              </h1>
              <h2 className="subtitle has-text-link">
                Posted by: {poster}
              </h2>
            </div>
          </div>

        </section>
        <div className="container">
          <div className="columns">
            <div className="column is-half">
              <LazyImg src={images && images[0]} className="shadowed" style={{ height: 282, background: '#eee' }}/>
            </div>
            <div className="column is-half">
              <Calender
                selectRange
                tileDisabled={({ date, view }) => (dateToDay(date) in (dates_unavailable || {}))}
                onChange={this.onChange} value={dates} />
            </div>
          </div>
          <br/>
          <div>
            <div className="columns">
              <div className="column is-4">
                <h1 className="is-size-4 has-text-weight-bold">Amenities</h1>
                <p>{amenities}</p>
                <h1 className="is-size-4 has-text-weight-bold">Policy</h1>
                <p>{policy || 'N/A'}</p>
              </div>
              <div className="column is-2">
                <h1 className="is-size-4 has-text-weight-bold">Rate</h1>
                <p>{rate || 1} $/Day</p>
                <h1 className="is-size-4 has-text-weight-bold">Size</h1>
                <p>{size || 'Medium'}</p>
              </div>
              <div className="column is-6">
                <h1 className="is-size-4 has-text-weight-bold">Description</h1>
                <p>{description}</p>
              </div>
            </div>
          </div>
          <br/>
          <div>
            {lister_id === db.getUser().uid ? (
              <button onClick={this.deleteListing} disabled={!data} className="button is-danger is-medium">
                <span>Delete this Listing</span>
              </button>
            ) : (
              <button className="button is-medium is-link" onClick={this.createBooking}
                disabled={!data}>
                Request Vroom
              </button>
            )}
          </div>
          <br/>
        </div>
      </div>
    );
  }
}
