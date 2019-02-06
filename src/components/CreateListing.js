import React from 'react';
import DayPicker from 'react-day-picker';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';
import StepWizard from 'react-step-wizard';

import SearchAddress from './SearchAddress';
import * as db from '../db';
import { dateToDay, encodeQuery } from '../utils';
import { LazyImg, Spinner } from './misc';


const Step = ({ title, nextStep, previousStep, children, onSubmit, currentStep, totalSteps, submitting }) => (
  <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit ? onSubmit() : nextStep();
  }}>
    <h1 className="is-size-1 has-text-centered">{title}</h1>
    <hr/>
    {children}
    <br/>
    <div className="columns is-centered">
      <div className="column is-4">
        <div className="buttons" style={{ justifyContent: 'space-around' }}>
          {currentStep > 1 && (
            <button
              type="button"
              className="button is-link is-inverted"
              onClick={previousStep}
            >
              Previous
            </button>
          )}
          {currentStep < totalSteps ? (
            <button
              type="submit"
              className="button is-link is-medium"
            >
              Next
            </button>
          ) : (
            <button type="submit" disabled={submitting}
              className={`button is-success is-medium ${submitting ? 'is-loading' : ''}`}>
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  </form>
);

const GMAPS_TOKEN = 'AIzaSyB7Y8NG-Wqd1DxWzM1ta8U_jDzi3ITiNPk';

const POLICIES_R = [{
  key: 'flexible',
  desc: 'Renters can cancel up to 24 hours before the a scheduled date, and are elligible to a full-refund.',
  className: 'is-success',
}, {
  key: 'moderate',
  desc: 'The booker can cancel their booking up to three days before \
their scheduled stay and are elligible to a 50% refund.',
  className: 'is-warning',
}, {
  key: 'strict',
  desc: 'All bookings are final, and no refunds are awarded to no-shows.',
  className: 'is-danger',
}];
const POLICIES = POLICIES_R.slice().reverse();

export default class CreateListing extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
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
      // cancellation_policy_index: 1,
      cancellation_policy: 'moderate',
      listing_img_url: '',
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

  handleUploadStart = () => this.setState({ isUploading: true });
  
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  }
  
  handleUploadSuccess = filename => {
    db.listingImages
    .child(filename)
    .getDownloadURL()
    .then(url => this.setState({ listing_img_url: url, isUploading: false }));
  }

  handleAmenitiesChange = (name) => (event) => {
    const checkedValue = event.target.checked;
    this.setState(({ amenities }) => {
      amenities[name] = checkedValue;
      return { amenities: { ...amenities } };
    });
  }

  handleRadioChange = (name, key) => () => {
    this.setState({ [name]: key });
  }

  handleSubmit = () => {
    const {
      listing_name, license_verification, description, amenities, listing_img_url,
      cancellation_policy, rate, dates_unavailable,
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
      images: listing_img_url ? [listing_img_url] : [],
      lister_id: db.getUser().uid,
      dates_unavailable,
      rate: Number.parseFloat(rate),
      created: db.Helpers.Timestamp.now(),
      status: 'active',
    };

    const query = encodeQuery({
      key: GMAPS_TOKEN,
      location: `${location[1]},${location[0]}`,
      size: '400x300',
    });

    this.setState({
      submitting: true,
    }, () => {
      window.fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?${query}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.status === 'OK') {
          data.images.push(`https://maps.googleapis.com/maps/api/streetview?${query}`);
        }
      })
      .catch(() => console.error)
      .then(() => db.createListing(data))
      .then(() => this.props.history.push('/mylistings'))
      .catch((err) => {
        this.setState({ submitting: false });
        window.alert('An error occurred while creating this listing');
        console.error(err);
      });
    });
  }

  handleAddressChange = ({ address, coords }) => {
    this.address = address;
    this.coords = coords;
  }

  render() {
    const {
      amenities, cancellation_policy, description, dates_unavailable,
      listing_name, size, rate, isUploading, listing_img_url, submitting,
    } = this.state;

    return (
      <section className="section">
        <div className="container">
          <StepWizard>
            <Step title="Where?">
              <div className="columns is-centered">
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Address</label>
                    <SearchAddress
                      required
                      onResult={this.handleAddressChange}
                    />
                  </div>
                  <div className="field">
                    <label className="label">Address Verification</label>
                    <input type="text" className="input" disabled
                      defaultValue="This feature is not key implemented"/>
                  </div>
                </div>
              </div>
            </Step>
            <Step title="What?">
              <div className="columns is-centered">
                <div className="column is-5">
                  <div className="field">
                    <label className="label">Listing name</label>
                    <div className="control">
                      <input
                        required
                        type="text"
                        placeholder="Text that will show up in searches"
                        className="input"
                        value={listing_name}
                        onChange={this.handleChange('listing_name')}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label"> Description</label>
                    <div className="control">
                      <textarea
                        required
                        placeholder="What best describes your parking space?"
                        value={description}
                        className="textarea"
                        style={{ height: 160, resize: 'none' }}
                        onChange={this.handleChange('description')}
                      />
                    </div>
                  </div>
                </div>
                <div className="column is-4">
                  <div className="field">
                    <label className="label">Upload a picture of your listing.</label>
                    <LazyImg src={isUploading ? null : listing_img_url} placeholder={isUploading ? <Spinner fullPage/> : null}
                      style={{ height: 240, width: '100%', background: '#eee' }} className="shadowed"/>
                    <br/>
                    
                    <CustomUploadButton
                      accept="image/*"
                      randomizeFilename
                      storageRef={db.listingImages}
                      onUploadStart={this.handleUploadStart}
                      onUploadError={this.handleUploadError}
                      onUploadSuccess={this.handleUploadSuccess}
                      className="button"
                    >
                      Select Image
                    </CustomUploadButton>
                  </div>
                </div>
              </div>
            </Step>
            <Step title="When are you busy?">
              <div className="columns is-centered">
                <div className="column is-4">
                  <div className="field">
                    <DayPicker
                      selectedDays={(date) => (dateToDay(date) in dates_unavailable)}
                      onDayClick={this.handleDayClick}
                    />
                  </div>
                </div>
              </div>
            </Step>
            <Step onSubmit={this.handleSubmit} title="How?" submitting={submitting}>
              <div className="columns">
                <div className="column is-6">
                  <div className="field">
                    <label className="label">Rate</label>
                    <div className="field has-addons">
                      <p className="control is-expanded">
                        <input
                          required
                          className="input"
                          placeholder="0.00"
                          type="number"
                          min={0}
                          max={300}
                          value={rate}
                          onChange={this.handleChange('rate')}
                          step={0.01}/>
                      </p>
                      <p className="control">
                        <a className="button is-static" style={{ borderWidth: 0 }}>
                          $ per night
                        </a>
                      </p>
                    </div>
                  </div>
                  <br/>
                  <div className="columns">
                    <div className="column">
                      <div className="field">
                        <label className="label">Amenities</label>
                        {['bathroom', 'water', 'wifi', 'electricity'].map((key) => (
                          <div className="field" key={key}>
                            <input
                              type="checkbox"
                              className="is-checkradio"
                              name={key}
                              id={key}
                              checked={amenities[key]}
                              onChange={this.handleAmenitiesChange(key)}
                            />{' '}
                            <label htmlFor={key} style={{ textTransform: 'capitalize' }}>{key}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="column">
                      <div className="field">
                        <label className="label">Size</label>
                        {['small', 'medium', 'large'].map((key) => (
                          <div className="field" key={key}>
                            <input
                              type="radio"
                              className="is-checkradio"
                              value={key}
                              id={key}
                              checked={size === key}
                              onChange={this.handleChange('size')}
                            />{' '}
                            <label htmlFor={key} style={{ textTransform: 'capitalize' }}>{key}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="column is-6">
                  <label className="label">Cancellation Policy</label>
                  <div className="field">
                    {POLICIES.map(({ key, desc, className }) => (
                      <div className="field" key={key}>
                        <input
                          type="radio"
                          className="is-checkradio"
                          value={key}
                          id={key}
                          checked={cancellation_policy === key}
                          onChange={this.handleChange('cancellation_policy')}
                        />{' '}
                        <label htmlFor={key} style={{ display: 'inline-block' }}>
                          <div className={`message ${className}`}>
                            <p className="message-header" style={{ textTransform: 'capitalize' }}>{key}</p>
                            <p className="message-body">{desc}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {/* <div className="flex-row" style={{ alignItems: 'stretch' }}>
                    <input
                      className={`slider ${POLICIES[cancellation_policy_index].className}`}
                      step={1}
                      min={0}
                      max={POLICIES.length - 1}
                      value={cancellation_policy_index}
                      type="range"
                      orient="vertical"
                      onChange={this.handlePolicyChange}
                    />
                    <div>
                      {POLICIES_R.map(({ key, desc, className }) => (
                        <div className={`message ${className}`} key={key}>
                          <p className="message-header" style={{ textTransform: 'capitalize' }}>{key}</p>
                          <p className="message-body">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
              
            </Step>
          </StepWizard>
        </div>
      </section>
    );
  }
}
