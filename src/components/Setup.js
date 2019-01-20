import React from 'react';

import * as db from '../db';


export default class Setup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: db.getUser().displayName,
      license_verification: false,
      location: [0,0],
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { location, name } = this.state;

    db.setupAccount({
      location: new db.Helpers.GeoPoint(location[0], location[1]),
      name,
      setup: true,
    })
    .then(() => this.props.history.push('/dashboard'));
  }

  getLocation = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  showPosition = (position) => {
    this.setState({ location: [position.coords.latitude, position.coords.longitude] });
  }

  render() {    
    return (
      <form onSubmit={this.handleSubmit} className="container">

        <br/>
        <h1 className="is-size-1">Account Setup</h1>

        <div className="field">
          <label className="label">Display Name</label>
          <div className="control">
            <input className="input" type="text" value={this.state.name} onChange={this.handleChange} />
          </div>
        </div>
        
        <div className="field">{}
          <label className="label">Location</label>
          <div className="control">
            <input className="input" type="text" value={this.state.location[0] + ',' + this.state.location[1]} onChange={this.handleChange} />
          </div>
        </div>


        <div className="field">
          <label className="label">How will you be using this service?</label>
          <div className="control">
            <div className="select">
              <select>
                <option value="lister">Lister</option>
                <option value="renter">Renter</option>
              </select>
            </div>
          </div>
        </div>
        <br/>
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-link">Finish Setup</button>
          </div>
        </div>
      </form>
    );
  }
}
