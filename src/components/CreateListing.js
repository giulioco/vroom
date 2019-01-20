import React from 'react';
import { Route, Link } from 'react-router-dom';
import SearchAddress from './SearchAddress';
import GeocodeMap from './GeocodeMap';
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

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
      listing_img: ""
    };
  }


  handleChange = (name) => (event) => {
    const target = event.target;
    this.setState({ [name]: target.value });
  }

 handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ listing_img: filename, progress: 100, isUploading: false });
    firebase.storage().ref("listing_images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ listing_imgURL: url }));
  };

  handleCheckboxChange = (name) => (event) => {
  	console.log(name + " = " + event.target.checked)
    const checkedValue = event.target.checked;
    this.setState(({ amenities }) => {
      amenities[name] = checkedValue;
      return { amenities: { ...amenities } };
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { listing_name, license_verification, description, amenities,  cancellation_policy, listing_img } = this.state; 
    const location = this.coords;
    const address = this.address;
    const data = {
    	listing_name: listing_name,
    	license_verification: license_verification,
    	address: address,
    	position: db.geo.point(location[1], location[0]).data,
    	description: description,
    	amenities: amenities,
    	cancellation_policy: cancellation_policy,
    	listing_img: listing_img
    };
    console.log(data);
    db.createListing(data)
    .then(() => this.props.history.push('/dashboard'));
  }

  handleAddressChange = ({ address, coords }) => {
  	console.log("handle address called!!")
    this.address = address;
    this.coords = coords;
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="container">
        <h1 className="is-size-1">Make a new listing</h1>
        <div className="field">
          <label className="label">Listing name</label>
            <div className="control">
              <input type="text" className="input" value={this.state.listing_name} onChange={this.handleChange("listing_name")} />
            </div>
        </div>

        <div className="field">
          <label className="label">Address</label>
              <SearchAddress onResult={this.handleAddressChange} />
        </div>

        <div className="field">
          {this.state.isUploading && <p> <progress className="progress is-success" value={this.state.progress} max="100">{this.state.progress}%</progress></p>}
          {this.state.listing_imgURL && <figure className="image is-128x128"><img className="is-rounded" src={this.state.listing_imgURL}/></figure>}

           <CustomUploadButton
              accept="image/*"
              name="listing_imgURL"
              randomizeFilename
              storageRef={firebase.storage().ref('listing_images')}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              className="button is-link"
              >
              Select Image
            </CustomUploadButton>
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
