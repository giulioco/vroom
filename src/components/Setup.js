import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBowlingBall } from '@fortawesome/free-solid-svg-icons';
import * as db from '../db';


export default class Setup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {name: db.userData.name, 
                  license_verification: false,
                  location: [0,0]
                  };
  }

  componentDidMount() {
    this.getLocation();
  }

  handleChange = (event) => {
    this.setState({name: event.target.value});
  }

  handleSubmit(event) {
    db.setupAccount()
  }

  getLocation = () => {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  showPosition = (position) => {
    this.setState({location: [position.coords.latitude, position.coords.longitude]});
  }

  render() {
    const user = db.getUser();
    
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.name} onChange={this.handleChange} />
        </label>
        <label>
          Location: [{this.state.location[0]},{this.state.location[1]}]
        </label>

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
