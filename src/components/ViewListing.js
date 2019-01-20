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
        data.amenities = amenitiesArray.join(", ")

        //find the poster using the id

        db.users.doc(data.lister_id).get().then((user) => {
          const userData = user.data();
          if (user.exists) {
            console.log(userData)
            data.poster = userData.name
          } else {
            data.poster = "A Vroomer"
          }

          console.log(data);
          this.setState({ data });
        });


      } else {
        console.log("The Listing you are looking for does not exist");
        this.setState({ data: null });
      }
    });
  }

  render() {
    const { data } = this.state;

    if (!data) return (
      <div>
        <h1>The listing you are looking for does not exist</h1>
      </div>
    );

    const { amenities, description, policy, rate, size } = data;

    return (
      <div>
        <section className="hero is-light">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {this.state.data.listing_name}
              </h1>
              <h2 className="subtitle">
              Posted by: {this.state.data.poster}
              </h2>
            </div>
          </div>
        </section>
        <div class="columns">
        <div className="column"></div>
          <div class="column">
            
        <h1 className="is-size-1">amenities</h1>
        <pre>{JSON.stringify(amenities)}</pre>
        <h1>description </h1>
        <p>{description}</p>
        <h1>policy</h1>
        <pre>{policy}</pre>
        <h1>rate</h1>
        <p>{rate}</p>
        <h1>size</h1>
        <p>{size}</p>

          </div>

          <div className="column"></div>

        </div>


        
      </div>
    );
  }
}
