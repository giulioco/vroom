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

  changeDate = (dates) => {
    this.setState({ dates });
  }

  render() {
    const { listings, radius, coords, dates } = this.state;

    return (
      <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'stretch' }}>
        <GeocodeMap onResult={this.onResult} listings={listings || []} radius={radius} center={coords}/>
        
        <div style={{ position: 'absolute', left: 0 }}>
          <Calender selectRange onChange={this.changeData} value={dates}/>
        </div>
        
        <div style={{ position: 'absolute', top: 300, left: 0, padding: 8 }}>
          <input className="slider is-fullwidth is-info" step="1" min="2" max="70"
            value={radius} type="range" orient="vertical" onChange={this.changeRadius}/>
          <div className="has-text-centered"><strong>Radius</strong><br/>{radius} km</div>
        </div>
        <div className="listings">
          {listings && listings.map((listing) => (
            <Link key={listing.id} className="box" to={`/listings/${listing.id}`}>
              <strong>{listing.address}</strong> <br/> <span>{listing.rate || 1} $/Day</span><br/>
              <p className="is-size-7">{listing.description}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
