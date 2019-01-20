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

        // amenities is stored as a map,
        // find the amenities the listing has,
        // make it into a string that can be displayed
        const amenitiesArray = [];
        const keys = Object.keys(data.amenities);
        for (const key of keys) {
          if (data.amenities[key]) {
            amenitiesArray.push(key);
          }
        }
        data.amenities = amenitiesArray.join(", ");

        // find the poster using the id
        db.users.doc(data.lister_id).get().then((user) => {
          const userData = user.data();
          if (user.exists) {
            data.poster = userData.name;
          } else {
            data.poster = "A Vroomer";
          }

          this.setState({ data });
        });


      } else {
        this.setState({ data: false });
      }
    });
  }

  deleteListing = () => {
    // make sure the logged in user owns this listing
    const listingID = this.props.match.params.id;
    const currentUser = db.getUser();

    db.listings.doc(listingID).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.lister_id === currentUser.uid) { // the current user is the owner if this listing
          if (!confirm('Are you sure? This will delete your listing forever.')) return;
          db.listings.doc(listingID).delete().then(() => this.props.history.push('/listings'));
        }
      }
    });
  }

  render() {
    const { data } = this.state;

    if (data === false) throw { code: 404 };

    if (!data) return null;

    const { amenities, description, policy, rate, size, listing_name, poster } = data;

    return (
      <div>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {listing_name}
              </h1>
              <h2 className="subtitle">
                Posted by: {poster}
              </h2>
            </div>
          </div>
        </section>

        <div className="container">
          <h1 className="is-size-4">Amenities</h1>
          <p>{amenities}</p>
          <h1 className="is-size-4">Description</h1>
          <p>{description}</p>
          <h1 className="is-size-4">Policy</h1>
          <p>{policy || 'N/A'}</p>
          <h1 className="is-size-4">Rate</h1>
          <p>{rate || 1} $/Day</p>
          <h1 className="is-size-4">Size</h1>
          <p>{size || 'Medium'}</p>
          <br/>
          <a className="button is-medium is-link">Request Vroom</a>

          {/* <div className="level-right"> */}
          {data.lister_id === db.getUser().uid ? (<a onClick={this.deleteListing} className="button is-danger is-outlined">
            <span>Delete</span>
            <span className="icon is-medium">
              <i className="fas fa-times"></i>
            </span>
          </a>) : null}

        </div>
      </div>
    );
  }
}
