import React from 'react';

import * as db from '../db';


export default class ViewListing extends React.Component {

  state = {
    data: null,
  }

  componentDidMount() {
    this.id = this.props.match.params.id;

    db.listings.doc(this.id).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        //amenities is stored as a map,
        // find the amenities the listing has,
        // make it into a string that can be displayed
        var amenitiesArray = []
        const keys = Object.keys(data.amenities)
        for (const key of keys) {
          if (data.amenities[key]) {
            amenitiesArray.push(key)
          }
        }
        data.amenities = amenitiesArray.join(" ")

        console.log(data);
        this.setState({ data });

      } else {
        console.log("The Listing you are looking for does not exist");
        this.setState({ data: null });
      }
    });
  }

  render() {
    if (this.state.data != null) {
      return (
        <div>
          {/* <h1>View listing {this.props.match.params.id}</h1> */}
          <h1 className="is-size-1">amenities</h1>
          <p>{this.state.data.amenities}</p>
          <h1>description </h1>
          <p>{this.state.data.description}</p>
          <h1>policy</h1>
          <p>{this.state.data.policy}</p>
          <h1>rate</h1>
          <p>{this.state.data.rate}</p>
          <h1>size</h1>
          <p>{this.state.data.size}</p>
        </div>
      );
    } else {
      return (
        <div>
          <h1>The listing you are looking for does not exist</h1>
        </div>
      );
    }
  }
}
