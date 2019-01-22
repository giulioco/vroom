import React from 'react';
import Calender from 'react-calendar';

import * as db from '../db';
import LazyImg from './LazyImg';


export default class ViewListing extends React.Component {

  state = {
    data: null,
    dates: null,
    imageUrl: null,
  }

  componentDidMount() {
    this.id = this.props.match.params.id;

    this.setState({
      dates: [db.bookingDates.start, db.bookingDates.end],
    });


    db.listings.doc(this.id).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        db.listingImages.child(data.listing_img).getDownloadURL()
        .then((imageUrl) => this.setState({ imageUrl }))
        .catch(console.error);


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

  createBooking = () => {
    const listingID = this.props.match.params.id;
    const bookerID = db.getUser().uid;

    db.listings.doc(listingID).get().then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        const bookingData = {
          lister_id: data.lister_id,
          booker_id: bookerID,
          start_date: this.state.dates[0],
          end_date: this.state.dates[1],
          status: "pending",
          listing_id: listingID,
        };

        db.bookings.add(bookingData);

        const ref = db.listings.doc(data.listing_id);
        db.transaction((trans) => {
          return trans.get(ref).then((docc) => {
            const dataa = docc.data();
            
            const dates_unavailable = dataa.dates_unavailable || [];
            
            const [start, end] = this.state.dates;
            
            while (start.getDate() <= end.getDate()) {
              dates_unavailable.push(new Date(start.getTime()));
              start.setDate(start.getDate() + 1);
            }

            return trans.update(ref, {
              dates_unavailable,
            });
          });
        });
  
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

  onChange = (dates) => {
    this.setState({ dates });
  }

  render() {
    const { data, dates, imageUrl } = this.state;

    if (data === false) throw { code: 404 };

    // if (!data) return null;

    const { amenities, description, policy, rate, size, listing_name, poster, lister_id } = data || {};

    return (
      <div>
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                {listing_name}
              </h1>
              <h2 className="subtitle has-text-link">
                Posted by: {poster}
              </h2>
            </div>
          </div>

        </section>
        <div className="container">
          <div className="columns">
            <div className="column is-half">
              <figure className="image shadowed">
                <LazyImg src={imageUrl} style={{ height: 282, width: '100%' }} placeholder="#eee"/>
              </figure>
            </div>
            <div className="column is-half">
              <Calender selectRange onChange={this.onChange} value={dates} />
            </div>
          </div>
          <br/>
          <div>
            <div className="columns">
              <div className="column is-4">
                <h1 className="is-size-4 has-text-weight-bold">Amenities</h1>
                <p>{amenities}</p>
                <h1 className="is-size-4 has-text-weight-bold">Policy</h1>
                <p>{policy || 'N/A'}</p>
              </div>
              <div className="column is-2">
                <h1 className="is-size-4 has-text-weight-bold">Rate</h1>
                <p>{rate || 1} $/Day</p>
                <h1 className="is-size-4 has-text-weight-bold">Size</h1>
                <p>{size || 'Medium'}</p>
              </div>
              <div className="column is-6">
                <h1 className="is-size-4 has-text-weight-bold">Description</h1>
                <p>{description}</p>
              </div>
            </div>
          </div>
          <br/>
          <div>
            {lister_id === db.getUser().uid ? (
              <button onClick={this.deleteListing} className="button is-danger is-medium">
                <span>Delete this Listing</span>
              </button>
            ) : (
              <button className="button is-medium is-link" onClick={this.createBooking}>Request Vroom</button>
            )}
          </div>
          <br/>
        </div>
      </div>
    );
  }
}

