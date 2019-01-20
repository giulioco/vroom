import React from 'react';
import { Route, Link } from 'react-router-dom';
import SearchAddress from './SearchAddress';
import GeocodeMap from './GeocodeMap';
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import DayPicker, { DateUtils } from 'react-day-picker';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import StepWizard from 'react-step-wizard';

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
      listing_img: "",
      dates_unavailable: []
    };

  }

  handleDayClick = (day, { selected }) => {
    const dates_unavailable  = this.state.dates_unavailable;
    if (selected) {
      const selectedIndex = dates_unavailable.findIndex(selectedDay =>
        DateUtils.isSameDay(selectedDay, day)
      );
      dates_unavailable.splice(selectedIndex, 1);
    } else {
      dates_unavailable.push(day);
    }
    this.setState({ dates_unavailable });
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
    const { listing_name, license_verification, description, amenities,  cancellation_policy, listing_img, dates_unavailable } = this.state; 
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
    	listing_img: listing_img,
    	lister_id: db.getUser().uid,
    	dates_unavailable: dates_unavailable
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
    <div className = "container is-centered has-text-centered">
	    	<h1 className="is-size-1">Make a new listing</h1>
		      <form onSubmit={this.handleSubmit}>
		        <div className="is-divider"></div>
		        <StepWizard>
			        <Step>
			        	{({ nextStep }) => 
			        		<>
			        			<div className="card">
				        			<div className="card-header">
					        			Where?
					        		</div>
					        		<div className="field">
							          <label className="label">Address</label>
							              <SearchAddress required onResult={this.handleAddressChange} />
							        </div>
								    <button onClick={nextStep}>Next</button>
								</div>
							</>
						}
		  			</Step>
		  			<Step>
			        	{({ nextStep, previousStep }) => 
			        		<>	
			        			<div className="card">
				        			<div className="card-header">
					        			What?
					        		</div>
					        		<div className="field">
							          <label className="label">Listing name</label>
							            <div className="control">
							              <input required type="text" placeholder="Text that will show up in searches" className="input" value={this.state.listing_name} onChange={this.handleChange("listing_name")} />
							            </div>
							        </div>
							        <div className="is-divider"></div>
							        <div className="field">
							          {this.state.isUploading && <p> <progress className="progress is-success" value={this.state.progress} max="100">{this.state.progress}%</progress></p>}
							          {this.state.listing_imgURL && <figure className="image is-128x128"><img className="is-rounded" src={this.state.listing_imgURL}/></figure>}
							          <p className="content">Upload a picture of your listing.</p>
							           <CustomUploadButton
							              required
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
							        <div className="is-divider"></div>
							        <div className="field">
							        <label className="label"> Description</label>
							          <div className="control">
							            <textarea required placeholder="What best describes your parking space?" value={this.state.description} className="textarea" onChange={this.handleChange("description")} />
							          </div>
							        </div>
				        			<button onClick={previousStep}>Previous</button>
							    	<button onClick={nextStep}>Next</button>
							   	</div>
						   </>
						}
		  			</Step>
		  			<Step>
			        	{({ nextStep, previousStep }) =>
			        		<>
			        			<div className="card">
				        			<div className="card-header">
					        			When?
					        		</div>
					        		<label className="label">
										Availability:
										<DayPicker
								          selectedDays={this.state.dates_unavailable}
								          onDayClick={this.handleDayClick}
								        />
							        </label>
				        			<button onClick={previousStep}>Previous</button>	
								    <button onClick={nextStep}>Next</button>
								</div>
			        		</>
						}
		  			</Step>
		  			<Step>
			        	{({ nextStep, previousStep }) =>
			        		<>
			        			<div className="card">
				        			<div className="card-header">
					        			How?
					        		</div>
					        		<div className="field">
								        <label className="label">
								        	Amenities
								        </label>
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
								    <div className="is-divider"></div>
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
							        <div className="is-divider"></div>
							        <div className="field">
							          <label className="label">
							            Rate $ 
							            <input required placeholder="0.00" type="number" min="0" value={this.state.rate} onChange={this.handleChange("rate")} step="0.01"/>
							            <i> per night</i>
							          </label>  
							        </div>
				        			<button onClick={previousStep}>Previous</button>	
								    <button onClick={nextStep}>Next</button>
								</div>
			        		</>
						}
		  			</Step>
		  			<Step>
			        	{({ nextStep, previousStep }) =>
			        		<>
			        			<div className="card">
				        			<div className="card-header">
					        			Policy
					        		</div>
					        		<div className="field">
							          <label className="label">
							            Cancellation Policy 
							            <div className="control">
							              <input className="slider is-fullwidth is-warning" step="1" min="0" max="2" value={this.state.cancellation_policy} type="range"
							                      onChange={this.handleChange("cancellation_policy")}></input>
							            </div>

							            <div className="columns is-mobile">
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

							            <div className="columns is-mobile">
							              <div className="column has-text-centered">
							                  Renters can cancel up to 24 hours before the a scheduled date, and are elligible to a full-refund.
							              </div>

							              <div className="column has-text-centered">
							                  The booker can cancel their booking up to three days before their scheduled stay and are elligible to a 50% refund.
							              </div>
							              <div className="column has-text-centered">
							                  All bookings are final, and no refunds are awarded to no-shows.
							              </div>
							            </div>

							          </label>
							        </div>
				        			<button onClick={previousStep}>Previous</button>
				        			<button type="submit" className="button">Submit</button>	
								</div>
			        		</>
						}
		  			</Step>
		        </StepWizard>
		      </form>
	        </div>
    );
	}
}


export class Step extends React.Component {
  render() {
  	const nextStep = this.props.nextStep;
  	const previousStep = this.props.previousStep;
    return (
      <div>
        {this.props.children({ nextStep, previousStep })}
      </div>
    );
  }
}




