import React from 'react';
import { Route, Link } from 'react-router-dom';

import ViewListing from './ViewListing';
import * as db from '../db';
import GeocodeMap from './GeocodeMap';


export default class Listings extends React.Component {

  state = {
    listings: null,
  }

  componentDidMount() {
    this.fetchListings();
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  fetchListings = () => {

    if (this.unsubscribe) this.unsubscribe();

    this.unsubscribe = db.listings.onSnapshot((snap) => {
      const listings = snap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });
      console.log(listings);
      this.setState({ listings });
    }, console.error);
  }

  searchForm = (e) => {
    e.preventDefault();

    console.log(e.location.value);
  }

  render() {
    const { listings } = this.state;

    return (
      <div>
        <div className="columns">
          <div className="column is-6">
            <GeocodeMap onResult={this.onResult} matches={[]} circleCenter={null} circleRadius={null}/>
          </div>
          <div className="column is-6">
            {listings && listings.map((listing) => (
              <div key={listing.id} className="box">{listing.address}</div>
            ))}
          </div>
        </div>
        <Route exact path="/listings/:id" component={ViewListing}/>
      </div>
    );
  }
}
