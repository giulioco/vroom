import React from 'react';
import firebase from 'firebase/app';
import DayPicker from 'react-day-picker';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import StepWizard from 'react-step-wizard';

import SearchAddress from './SearchAddress';
import * as db from '../db';
import { dateToDay } from '../utils';


const Step = ({ nextStep, previousStep, children, onSubmit }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit ? onSubmit() : nextStep();
  }}>
    {children({ previousStep })}
  </form>
);

export default class CreateListing extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      listing_name: '',
      license_verification: false,
      description: '',
      amenities: {
        bathroom: false,
        water: false,
        wifi: false,
        electricity: false,
      },
      // house_rules: '',
      rate: '',
      size: '',
      cancellation_policy: '0',
      listing_img: '',
      dates_unavailable: {},
    };

  }

  handleDayClick = (day, { selected }) => {
    const dayNum = dateToDay(day);
    this.setState(({ dates_unavailable }) => {
      if (selected) {
        delete dates_unavailable[dayNum];
      } else {
        dates_unavailable[dayNum] = true;
      }
      return { dates_unavailable: { ...dates_unavailable } };
    });
  }

  handleChange = (name) => (event) => {
    const val = event.target.value;
    this.setState({ [name]: val });
  }

  handlePolicyChange = (name) => (event) => {
    let type = '';
    const targetValue = event.target.value;
    if (targetValue <= 0) {
      type = 'flexible';
    } else if (targetValue === 1) {
      type = 'moderate';
    } else if (targetValue >= 2) {
      type = 'strict';
    }
    this.setState({ [name]: type });
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

  handleProgress = progress => this.setState({ progress });
  
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  }
  
  handleUploadSuccess = filename => {
    this.setState({ listing_img: filename, progress: 100, isUploading: false });
    firebase.storage().ref('listing_images')
    .child(filename)
    .getDownloadURL()
    .then(url => this.setState({ listing_imgURL: url }));
  }

  handleCheckboxChange = (name) => (event) => {
    const checkedValue = event.target.checked;
    this.setState(({ amenities }) => {
      amenities[name] = checkedValue;
      return { amenities: { ...amenities } };
    });
  }

  handleSubmit = () => {
    const {
      listing_name, license_verification, description, amenities,
      cancellation_policy, listing_img, rate, dates_unavailable,
    } = this.state;
    
    const location = this.coords;
    const address = this.address;
    const data = {
      listing_name,
      license_verification,
      address,
      position: db.geo.point(location[1], location[0]).data,
      description,
      amenities,
      cancellation_policy,
      listing_img,
      lister_id: db.getUser().uid,
      dates_unavailable,
      rate,
      created: db.Helpers.Timestamp.now(),
      status: 'active',
    };

    db.createListing(data)
    .then(() => this.props.history.push('/mylistings'))
    .catch(console.error);
  }

  handleAddressChange = ({ address, coords }) => {
    this.address = address;
    this.coords = coords;
  }

  render() {
    return (
      <div className="is-centered has-text-centered" id="doit">
        <StepWizard>
          <Step>
            {() => (
              <div className="hero is-medium is-light is-bold is-fullwidth">
                <div className="hero-body">
                  <div className="">
                    <h1 className="title">Where?</h1>
                  </div>
                  <hr/>
                  <div className="field">
                    <label className="label">Address</label>
                    <SearchAddress
                      required
                      onResult={this.handleAddressChange}
                    />
                  </div>
                  <button type="submit" className="button is-link">
                    Next
                  </button>
                </div>
              </div>
            )}
          </Step>
          <Step>
            {({ previousStep }) => (
              <>
                <div className="hero is-medium is-light is-bold">
                  <div className="hero-body">
                    <div className="">
                      <h1 className="title">What?</h1>
                    </div>
                    <hr/>
  
                    <div className="columns">
                      <div className="column">
                        <div className="field">
                          <label className="label">Listing name</label>
                          <div className="control">
                            <input
                              required
                              type="text"
                              placeholder="Text that will show up in searches"
                              className="input"
                              value={this.state.listing_name}
                              onChange={this.handleChange('listing_name')}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          {this.state.isUploading && (
                            <p>
                              {' '}
                              <progress
                                className="progress is-success"
                                value={this.state.progress}
                                max="100"
                              >
                                {this.state.progress}%
                              </progress>
                            </p>
                          )}
                          {this.state.listing_imgURL && (
                            <figure className="image">
                              <img src={this.state.listing_imgURL} />
                            </figure>
                          )}
                          <p className="content">
                            Upload a picture of your listing.
                          </p>
                          <CustomUploadButton
                            accept="image/*"
                            name="listing_imgURL"
                            randomizeFilename
                            storageRef={firebase.storage().ref('listing_images')}
                            onUploadStart={this.handleUploadStart}
                            onUploadError={this.handleUploadError}
                            onUploadSuccess={this.handleUploadSuccess}
                            onProgress={this.handleProgress}
                            className="button"
                          >
                            Select Image
                          </CustomUploadButton>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label"> Description</label>
                          <div className="control">
                            <textarea
                              required
                              placeholder="What best describes your parking space?"
                              value={this.state.description}
                              className="textarea"
                              onChange={this.handleChange('description')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="column is-4 is-offset-one-third">
                      <div className="buttons is-centered">
                        <button
                          type="button"
                          className="button is-link is-inverted"
                          onClick={previousStep}
                        >
                          Previous
                        </button>
                        <button
                          type="submit"
                          className="button is-link"
                        >
                          Next
                        </button>
                      </div>
                    </div>
  
                    {/* vvv end of container */}
                  </div>
                </div>
              </>
            )}
          </Step>
          <Step>
            {({ previousStep }) => (
              <>
                <div className="hero is-medium is-light is-bold">
                  <div className="hero-body">
                    <div className="">
                      <h1 className="title">When are you busy?</h1>
                    </div>
                    <hr/>
                    <div className="field">
                      <label className="label">
                        <DayPicker
                          selectedDays={this.state.dates_unavailable}
                          onDayClick={this.handleDayClick}
                        />
                      </label>
                    </div>
                    <div className="column is-4 is-offset-one-third">
                      <div className="buttons is-centered">
                        <button
                          type="button"
                          className="button is-link is-inverted"
                          onClick={previousStep}
                        >
                          Previous
                        </button>
                        <button
                          type="submit"
                          className="button is-link"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Step>
          <Step onSubmit={this.handleSubmit}>
            {({ previousStep }) => (
              <>
                <div className="hero is-medium is-light is-bold">
                  <div className="hero-body">
                    <div className="container">
                      <h1 className="title">How?</h1>
                      <hr/>
                    </div>
                    <div className="columns has-text-left">
                      <div className="column is-centered is-3 is-offset-one-quarter">
                        <div className="field">
                          <label className="label">Amenities</label>
                          <div className="field">
                            <input
                              type="checkbox"
                              className="is-checkradio"
                              name="bathroom"
                              id="bathroom"
                              checked={this.state.amenities.bathroom}
                              onChange={this.handleCheckboxChange('bathroom')}
                            />{' '}
                            <label htmlFor="bathroom">Bathroom </label>
                          </div>
                          <div className="field">
                            <input
                              type="checkbox"
                              className="is-checkradio"
                              name="water"
                              id="water"
                              checked={this.state.amenities.water}
                              onChange={this.handleCheckboxChange('water')}
                            />{' '}
                            <label htmlFor="water">Water </label>
                          </div>
                          <div className="field">
                            <input
                              type="checkbox"
                              className="is-checkradio"
                              name="wifi"
                              id="wifi"
                              checked={this.state.amenities.wifi}
                              onChange={this.handleCheckboxChange('wifi')}
                            />{' '}
                            <label htmlFor="wifi"> WiFi </label>
                          </div>
                          <div className="field">
                            <input
                              type="checkbox"
                              className="is-checkradio"
                              name="electricity"
                              id="electricity"
                              checked={this.state.amenities.electricity}
                              onChange={this.handleCheckboxChange('electricity')}
                            />{' '}
                            <label htmlFor="electricity"> Electricity </label>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div>
                          <label className="label">
                            Size:
                            <div className="select">
                              <select
                                value={this.state.size}
                                onChange={this.handleChange('size')}
                              >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="Large">Large</option>
                              </select>
                            </div>
                          </label>
                        </div>
                        <div>
                          <div className="field">
                            <div className="control">
                              <label className="label">
                                Rate $
                                <input
                                  required
                                  className="input"
                                  placeholder="0.00"
                                  type="number"
                                  min="0"
                                  max="300"
                                  value={this.state.rate}
                                  onChange={this.handleChange('rate')}
                                  step="0.5"
                                />
                                <i> per night</i>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
  
                    {/*  */}
                    <div className="field">
                      <label className="label">
                        Cancellation Policy
                        <div className="control">
                          <input
                            className={`slider is-fullwidth  ${
                              this.state.cancellation_policy === '0'
                                ? 'is-success'
                                : this.state.cancellation_policy === '1'
                                  ? 'is-warning'
                                  : 'is-danger'
                            }`}
                            step="1"
                            min="0"
                            max="2"
                            value={this.state.cancellation_policy}
                            type="range"
                            onChange={this.handleChange('cancellation_policy')}
                          />
                        </div>
                        <div className="columns is-mobile">
                          <div className="column has-text-centered">
                            <span
                              className="badge has-text-weight-bold is-badge-outlined"
                              data-badge=""
                            >
                              Flexible
                            </span>
                          </div>
  
                          <div className="column has-text-weight-bold has-text-centered">
                            <span
                              className="badge is-badge-success is-badge-outlined"
                              data-badge=""
                            >
                              Moderate
                            </span>
                          </div>
                          <div className="column has-text-weight-bold has-text-centered">
                            <span
                              className="badge is-badge-warning is-badge-outlined"
                              data-badge=""
                            >
                              Strict
                            </span>
                          </div>
                        </div>
                        <div className="columns is-mobile">
                          <div className="column has-text-weight-light has-text-centered">
                            Renters can cancel up to 24 hours before the a
                            scheduled date, and are elligible to a full-refund.
                          </div>
  
                          <div className="column has-text-weight-light has-text-centered">
                            The booker can cancel their booking up to three days
                            before their scheduled stay and are elligible to a 50%
                            refund.
                          </div>
                          <div className="column has-text-weight-light has-text-centered">
                            All bookings are final, and no refunds are awarded to
                            no-shows.
                          </div>
                        </div>
                      </label>
                    </div>
                    {/*  */}
                    <div className="column is-4 is-offset-one-third">
                      <div className="buttons is-centered">
                        <button
                          type="button"
                          className="button is-link is-inverted"
                          onClick={previousStep}
                        >
                          Previous
                        </button>
                        <button type="submit" className="button is-success">
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Step>
        </StepWizard>
      </div>
    );
  }
}
