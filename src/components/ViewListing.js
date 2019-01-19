import React from 'react';
import { Route, Link } from 'react-router-dom';

import * as db from '../db';


export default class Listings extends React.Component {

  state = {
    listings: null,
  }

  componentDidMount() {
    this.unsubscribe = db.getListings().then((listings) => {
      this.setState({ listings });
    });
  }


  render() {
    const { listings } = this.state;

    return (
      <div>
        <h1>View listing</h1>
      </div>
    );
  }
}
