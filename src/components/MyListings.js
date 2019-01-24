import React from 'react';

import * as db from '../db';
import { ListingEntry } from './BookingEntry';


class _ListingEntry extends React.Component {

  state = {
    image_url: null,
  }

  componentDidMount() {
    const img = this.props.listing.listing_img;
    if (img) {
      db.listingImages.child(img).getDownloadURL()
      .then(image_url => this.setState({ image_url }))
      .catch(console.error);
    }
  }

  render() {
    const { image_url } = this.state;
    return <ListingEntry {...this.props} listing={{ ...this.props.listing, image_url }}/>;
  }
}

export default class MyListings extends React.Component {

  state = {
    listings: null,
  }

  componentDidMount() {
    this.userId = db.getUser().uid;

    db.listings.where('lister_id', '==', this.userId).onSnapshot((snap) => {
      const listings = snap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });

      this.setState({ listings });
    });
  }

  removeListing = (id) => () => {
    db.listings.doc(id).delete();
  }

  render() {
    const { listings } = this.state;

    let Content = null;
    if (listings) {
      if (listings.length) Content = listings.map((listing) => (
        <_ListingEntry listing={listing} key={listing.id}
          buttons={<button className="button is-danger" onClick={this.removeListing(listing.id)}>Remove</button>}/>
      ));
      else Content = (
        <div className="box">
          <p className="is-size-4 has-text-link has-text-centered">Nothing here</p>
        </div>
      );
    }

    return (
      <section className="section">
        <div className="container">
          <h1 className="is-size-1">My Listings</h1>
          <br/>
          {Content}
        </div>
      </section>
    );
  }
}
