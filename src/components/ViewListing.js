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

  createBooking = () => {
    // make sure the logged in user owns this listing
    console.log("in create booking")
    let listingID = this.props.match.params.id
    var bookerID = db.getUser().uid

    console.log(db.bookingDates)

    db.listings.doc(listingID).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        var bookingData = {
          lister_id: data.lister_id,
          booker_id: bookerID,
          start_date: db.bookingDates.start,
          end_date: db.bookingDates.end,
          status: "pending",
          listing_id: listingID
        }

        db.bookings.add(bookingData);
        console.log("added booking to db")

        //add dates in between to listing.dates_unavailable


      }
    });
  }


  deleteListing = () => {
    // make sure the logged in user owns this listing
    let listingID = this.props.match.params.id
    var currentUser = db.getUser()

    db.listings.doc(listingID).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        if (data.lister_id == currentUser.uid) { //the current user is the owner if this listing
          if (!confirm('Are you sure? This will delete your listing forever.')) return;
          console.log("will delete (not really, this for testing) ")
          console.log(listingID)
          db.listings.doc(listingID).delete().then(() => this.props.history.push('/listings'))
        }
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

    const { amenities, description, policy, rate, size, listing_name, poster } = data;

    return (
      <div>
        <section className="hero is-light">
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
        <div class="columns">
          <div className="column"></div>
          <div class="column is-two-thirds">

            <h1 className="is-size-4">amenities</h1>
            <pre>{JSON.stringify(amenities)}</pre>
            <h1 className="is-size-4">description </h1>
            <p>{this.state.data.description}</p>
            <h1 className="is-size-4">policy</h1>
            <pre>{this.state.data.policy}</pre>
            <h1 className="is-size-4">rate</h1>
            <p>{this.state.data.rate}</p>
            <h1 className="is-size-4">Parking spot size</h1>
            <p>{this.state.data.size}</p>

            <nav className="level">
              {/* <div className="level-left"> */}
              <div className="level-item">
                <a onClick={this.createBooking} class="button is-medium is-fullwidth">Request Vroom</a>
                {/* </div> */}
              </div>

              {/* <div className="level-right"> */}
              {data.lister_id == db.getUser().uid ? (<a onClick={this.deleteListing} class="button is-danger is-outlined">
                <span>Delete</span>
                <span class="icon is-medium">
                  <i class="fas fa-times"></i>
                </span>
              </a>) : null}
              {/* </div> */}
            </nav>
          </div>
          <div className="column"></div>
        </div>

        <footer className="footer"></footer>



      </div>
    );
  }
}
