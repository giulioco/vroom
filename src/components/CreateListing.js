import React from 'react';
import { Route, Link } from 'react-router-dom';
import SearchAddress from './SearchAddress';


export default class CreateListing extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      listing_name: "Your listing name", 
      license_verification: false,
      description: "Your description here",
      amenities: "",
      house_rules: "",
      size: "",
      cancellation_policy: "",
    };
  }


  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  }

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
        <label className="label">
          Listing name:
          <input type="text" value={this.state.listing_name} onChange={this.handleChange("listing_name")} />
        </label>
        <label className="label">
          Address: 
          {/* <input type="text" value={this.state.address} onChange={this.handleChange("address")} /> */}
          <SearchAddress onResult={this.handleAddressChange}/>
        </label>
        <label className="label">
          Description: 
          <textarea value={this.state.description} onChange={this.handleChange("description")} />
        </label>
        <label className="label">
          Amenities: 
          <select multiple={true} value={['bathroom', 'water']} onChange={this.handleChange("amenities")}>
            <option value="bathroom">Bathroom</option>
            <option value="water">Water</option>
            <option value="wifi">WiFi</option>
            <option value="electricity">electricity</option>
          </select>
        </label>
        <label className="label">
          Cancellation Policy: 
          <select value={this.state.cancellation_policy} onChange={this.handleChange("cancellation_policy")}>
            <option value="strict">Strict</option>
            <option value="moderate">Moderate</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>
        <label className="label">
          Size: 
          <select value={this.state.size} onChange={this.handleChange("size")}>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="Large">Large</option>
          </select>
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
