import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlingBall } from '@fortawesome/free-solid-svg-icons';
import * as db from '../db';


export default class Setup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: db.userData.name, 
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
      location,
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
    const user = db.getUser();
    
    return (
      <form onSubmit={this.handleSubmit}>
        <label className="label">
          Name:
          <input type="text" value={this.state.name} onChange={this.handleChange} />
        </label>
        <label className="label">
          Location: [{this.state.location[0]},{this.state.location[1]}]
        </label>

        <button type="submit" className="button">Submit</button>
      </form>
    );
  }
}
