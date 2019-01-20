import React from 'react';
import { Link } from 'react-router-dom';

import * as db from '../db';
import GeocodeMap from './GeocodeMap';


export default class Listings extends React.Component {

  state = {
    listings: null,
    radius: 5,
    coords: null,
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
    const { coords, radius } = this.state;

    if (!coords) return;

    if (this.unsubscribe) this.unsubscribe();

    this.unsubscribe = db.getListings(coords[0], coords[1], radius, (listings) => {
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

  render() {
    const { listings, radius, coords } = this.state;

    return (
      <div>
        <div style={{ position: 'relative' }}>
          <GeocodeMap onResult={this.onResult} listings={listings || []} radius={radius} center={coords}/>
          <div style={{ position: 'absolute', top: 300, left: 0, padding: 8 }}>
            <input className="slider is-fullwidth" step="1" min="2" max="300"
              value={radius} type="range" orient="vertical" onChange={this.changeRadius}/>
            <div className="has-text-centered"><strong>Radius</strong><br/>{radius} km</div>
          </div>
          <div className="listings">
            {listings && listings.map((listing) => (
              <Link key={listing.id} className="box" to={`/listing/${listing.id}`}>{listing.address}</Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
