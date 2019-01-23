import React from 'react';

import * as db from '../db';


export default class MyListings extends React.Component {

  state = {
    listings: null,
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
    return (
      <div> my listings ---  under construction ---</div>

      // display the contents/listings from this.listing
    );
  }
}
