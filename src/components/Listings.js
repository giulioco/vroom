import React from 'react';
import { Link, Route } from 'react-router-dom';
import Calender from 'react-calendar';

import * as db from '../db';
import ListingMap from './ListingMap';
import ViewListing from './ViewListing';
import { LazyImg } from './misc';


const _ViewListing = (props) => (
  <div className="modal is-active">
    <Link className="modal-background" to="/listings" />
    <div className="modal-content">
      <div className="box">
        <ViewListing {...props} />
      </div>
    </div>
    <Link className="modal-close is-large" aria-label="close" to="/listings" />
  </div>
);

export default class Listings extends React.Component {

  state = {
    listings: null,
    radius: 5,
    dates: null,
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  fetchListings = () => {
    const { radius, dates } = this.state;

    if (!this.coords || !dates) return;

    if (this.unsubscribe) this.unsubscribe();

    this.unsubscribe = db.getListings(this.coords[0], this.coords[1], radius, dates, (listings) => {
      this.setState({ listings });
    });
  }

  onResult = ({ coords, address }) => {
    this.coords = coords;
    this.address = address;

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(this.fetchListings, 1000);
    // this.fetchListings();
  }

  changeRadius = (e) => {

    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(this.fetchListings, 1000);

    this.setState({ radius: Number.parseInt(e.target.value, 10) });
  }

  changeDate = (dates) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.timeout = setTimeout(this.fetchListings, 1000);

    db.bookingDates.start = dates[0];
    db.bookingDates.end = dates[1];

    this.setState({ dates });
  }

  render() {
    const { listings, radius, dates } = this.state;

    return (
      <>
        <div className="layers">

          <ListingMap onResult={this.onResult} listings={listings || []} radius={radius} />

          <div className="columns through-click">
            <div className="column is-3"
              style={{ justifyContent: 'flex-end', display: 'flex', flexDirection: 'column' }}>
              {!dates && (
                <p className="has-text-danger has-text-weight-bold">Please select a date range</p>
              )}
              <Calender selectRange onChange={this.changeDate} value={dates}/>
              <div className="flex-row" style={{ marginTop: 12 }}>
                <span className="has-text-centered has-text-white">
                  <strong className="has-text-white">Radius</strong><br />{radius} km
                </span>
                <input className="slider is-fullwidth is-link" step="1" min="2" max="70"
                  value={radius} type="range" onChange={this.changeRadius} style={{ marginLeft: 16 }} />
              </div>
            </div>

            <div className="column is-3 is-offset-6 listings">
              {listings && listings.map((listing) => {

                let desc = listing.listing_name || '';
                if (desc.length > 64) desc = `${desc.substring(0, 64)}...`;

                return (
                  <Link key={listing.id} className="box" to={`/listings/${listing.id}`}>
                    <LazyImg src={listing.images && listing.images[0]}
                      style={{ height: 180, background: '#eee' }}/>
                    <br/>
                    <strong>{listing.address}</strong>
                    <br/>
                    <div className="has-text-truncated">
                      <span>{listing.rate || 1} <span className="is-size-7 has-text-grey">$/Day</span></span>
                      &nbsp;
                      <span className="is-size-7 has-text-link">{desc}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <Route exact path="/listings/:id" component={_ViewListing} />
      </>
    );
  }
}
