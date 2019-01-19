import React from 'react';
import { Route, Link } from 'react-router-dom';

import ViewListing from './ViewListing';


export default class Listings extends React.Component {

  componentDidMount() {
    this.fetchListings();
  }

  fetchListings = () => {

  }

  searchForm = (e) => {
    e.preventDefault();

    console.log(e.location.value);
  }

  render() {

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
