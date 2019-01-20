import React from 'react';
import { Link } from 'react-router-dom';
import Calender from 'react-calendar';

import * as db from '../db';
import GeocodeMap from './GeocodeMap';


export default class Listings extends React.Component {

  state = {
    listings: null,
    radius: 5,
    coords: null,
    dates: null,
  }

  componentDidMount() {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.setState({ coords: [coords.latitude, coords.longitude] }, this.fetchListings);
      }, console.error);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  fetchListings = () => {
    const { coords, radius, dates } = this.state;

    if (!coords || !dates) return;

    if (this.unsubscribe) this.unsubscribe();

    this.unsubscribe = db.getListings(coords[0], coords[1], radius, dates, (listings) => {
      this.setState({ listings });
    });
  }

  onResult = ({ coords, address }) => {
    this.setState({ coords }, this.fetchListings);
    this.address = address;
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

    this.setState({ dates });
  }

  render() {
    const { listings, radius, coords, dates } = this.state;

    return (
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'stretch' }}>
        <GeocodeMap onResult={this.onResult} listings={listings || []} radius={radius} center={coords}/>
        
        <div style={{ position: 'absolute', left: 20, bottom: 80 }}>
          { !dates && (<p className="has-text-danger has-text-weight-bold has-text-centered">Please select a date range</p>)}
          <Calender selectRange onChange={this.changeDate} value={dates}/>
        </div>
        
        <div style={{ position: 'absolute', bottom: 0, left: 0, padding: 16, display: 'flex' }}>
          <span className="has-text-centered has-text-white">
            <strong className="has-text-white">Radius</strong><br/>{radius} km
          </span>
          <input className="slider is-fullwidth is-link" step="1" min="2" max="70"
            value={radius} type="range" onChange={this.changeRadius} style={{ marginLeft: 16, width: 290 }}/>
        </div>

        <div className="listings">
          {listings && listings.map((listing) => {

            let desc = listing.listing_name || '';
            if (desc.length > 64) desc = desc.substring(0, 64) + '...';

            return (
              <Link key={listing.id} className="box" to={`/listings/${listing.id}`}>
                <strong>{listing.address}</strong><br/>
                <span>{listing.rate || 1} <span className="is-size-7 has-text-grey">$/Day</span></span>&nbsp;
                <span className="is-size-7 has-text-link">{desc}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
