import React from 'react';
import { Route, Link } from 'react-router-dom';

import ViewListing from './ViewListing';
import * as db from '../db';


export default class Listings extends React.Component {

  state = {
    listings: null,
  }

  componentDidMount() {
    this.fetchListings();
  }

  fetchListings = () => {

    this.listingId = this.props.match.params.id;

    this.unsubscribe = db.getListings().then((listings) => {
      this.setState({ listings });
    });
  }

  searchForm = (e) => {
    e.preventDefault();

    console.log(e.location.value);
  }

  render() {
    const { listings } = this.state;

    return (
      <div>
        <form onSubmit={this.searchForm}>
          <input type="text" name="location"/>
          <button type="submit" className="button">Search</button>
        </form>
        <Route exact path="/listings/:id" component={ViewListing}/>
      </div>
    );
  }
}
