import React from 'react';
import { Route, Link } from 'react-router-dom';
import SearchAddress from './SearchAddress';
import GeocodeMap from './GeocodeMap';

export default class CreateListing extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      listing_name: "", 
      license_verification: false,
      description: "",
      amenities: {
        bathroom: false,
        water: false,
        wifi: false,
        electricity: false
      },
      house_rules: "",
      size: "",
      cancellation_policy: 0,
      location: [0,0],
    };
  }


  handleChange = (name) => (event) => {
    const target = event.target;
    this.setState({ [name]: target.value });
  }

  handleCheckboxChange = (name) => (event) => {
  	console.log(name + " = " + event.target.checked)
    const checkedValue = event.target.checked;
    this.setState(({ amenities }) => {
      amenities[name] = checkedValue;
      return { amenities: { ...amenities } };
    });
  }

  // handleSliderChange = (name) => (event) => {
  //   const value = event.target.value;
  //   const checkedValue = event.target.checked;
  //   //this.setState({ [name]: this.state.policies[value] })

  //   this.setState(({ cancellation_policy }) => {
  //     cancellation_policy[value] = value;
  //     return { amenities: { ...amenities } };
  //   });
  // }

  handleSubmit = (event) => {
    event.preventDefault();

  }

  handleAddressChange = ({ address, coords }) => {
    this.address = address;
    this.coords = coords;
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit} className="container">

        <div className="field">
          <label className="label">Listing name</label>
            <div className="control">
              <input type="text" className="input" value={this.state.listing_name} onChange={this.handleChange("listing_name")} />
            </div>
        </div>

        <div className="field">
          <label className="label">Address</label>
              <SearchAddress/>
        </div>

        <div className="field">
        <label className="label"> Description</label>
          <div className="control">
            <textarea value={this.state.description} className="textarea" onChange={this.handleChange("description")} />
          </div>
        </div>

        <div className="field">
        <label className="label">Amenities</label>
         	<div className="field">
            <input  type="checkbox" 
            		className="is-checkradio"
                    name="bathroom"
                    id="bathroom"
                    checked={this.state.amenities.bathroom} 
                    onChange={this.handleCheckboxChange("bathroom")}/> <label htmlFor="bathroom">Bathroom </label> 
            </div>
            <div className="field">
            <input  type="checkbox" 
            		className="is-checkradio"
                    name="water"
                    id="water"
                    checked={this.state.amenities.water} 
                    onChange={this.handleCheckboxChange("water")}/> <label htmlFor="water">Water </label>
            </div>
            <div className="field">
            <input  type="checkbox" 
            		className="is-checkradio"
                    name="wifi"
                    id="wifi"
                    checked={this.state.amenities.wifi} 
                    onChange={this.handleCheckboxChange("wifi")}/> <label htmlFor="wifi"> WiFi </label>
            </div>
            <div className="field">
            <input  type="checkbox" 
            		className="is-checkradio"
                    name="electricity"
                    id="electricity"
                    checked={this.state.amenities.electricity} 
                    onChange={this.handleCheckboxChange("electricity")}/> <label htmlFor="electricity"> Electricity </label>
             </div>
        </div>

        <div className="field">
          <label className="label">
            Cancellation Policy 
            <div className="control">
              <input className="slider is-fullwidth" step="1" min="0" max="2" value={this.state.cancellation_policy} type="range"
                      onChange={this.handleChange("cancellation_policy")}></input>

            </div>
            <div className="columns">
              <div className="column has-text-centered">
                <span className="badge is-badge-outlined" data-badge="">
                  Flexible
                </span>
              </div>
              <div className="column has-text-centered">
                <span className="badge is-badge-success is-badge-outlined" data-badge="">
                  Moderate
                </span>
              </div>
              <div className="column has-text-centered">
                <span className="badge is-badge-warning is-badge-outlined" data-badge="">
                  Strict
                </span>
              </div>
              </div>
          </label>
        </div>


        <label className="label">
          Size: 
          <div className="select">
          <select value={this.state.size} onChange={this.handleChange("size")}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="Large">Large</option>
          </select>
          </div>
        </label>


        <label className="label">
          Rate: 
          <input type="range" min="0" max="50" value={this.state.rate} onChange={this.handleChange("rate")} step="1"/>
        </label>

        <button type="submit" className="button">Submit</button>
      </form>
    );
	}
}
