import React from 'react';

import * as db from '../db';
import LazyImg from './LazyImg';



export default class MyListings extends React.Component {

  state = {
    listings: [],
    totalListings: 0
  }

  componentDidMount() {
    this.userID = this.props.match.params.id;

    db.users.doc(this.userID).get().then((user) => {
      const userData = user.data();
      var numberListings = 0;
      if (user.exists) {
        // console.log(userData);
        db.listings.where("lister_id", "==", this.userID).get()
          .then((listing) => {
            var mylistings = []
            // const listingData = listing.data();
            listing.forEach(function (doc) {
              // console.log(doc.id, " => ", doc.data());
              mylistings.push(doc.data());
              numberListings++;
            });

            this.setState({ listings: mylistings, totalListings: numberListings })
            console.log(this.state)
          })
      }
    });
  }

  createList() {
    var list = [];

    for (var i = 0; i < this.state.totalListings; i++) {
      thisListing = this.state.listings[i];
      list.push(<div> {thisListing.address}</div>)
    }
    console.log(list)
    return list;
  }

  render() {
    const { listings, totalListings } = this.state;

    if (totalListings == 0) {
      return (
        <div>You have no published listings</div>
      )
    }

    var listingList = listings.map((l) =>
      <div>
        <div>{l.listing_name}</div>
        {/* <LazyImg src={l.listing_img} style={{ height: 282, width: '100%' }} placeholder="#eee" />
        <div>{l.amenities}</div>
        <div>{l.policy || 'N/A'}</div>
        <div>{l.size || 'Medium'}</div>
        <div>{l.description}</div> */}
      </div>
    )
    return (
      <div>
        {/* <div> my listings ---  under construction ---</div> */}
        <div> {listingList}</div>
      </div>

      // display the contents/listings from this.listing
    );
  }
}
