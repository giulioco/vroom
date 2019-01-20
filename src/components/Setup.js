import React from 'react';

import * as db from '../db';
import firebase from "firebase";
import FileUploader from "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';


export default class Setup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: db.getUser().displayName,
      license_verification: false,
      location: [0,0],
      avatar: ""
    };
  }

  componentDidMount() {
    this.getLocation();
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = progress => this.setState({ progress });
  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase.storage().ref("user_images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { location, name, avatar } = this.state;

    db.setupAccount({
      location: new db.Helpers.GeoPoint(location[0], location[1]),
      name,
      image_name: avatar,
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
    console.log(position);
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
        <div className="field">
          {this.state.isUploading && <p> <progress className="progress is-success" value={this.state.progress} max="100">{this.state.progress}%</progress></p>}
          {this.state.avatarURL && <figure className="image is-128x128"><img className="is-rounded" src={this.state.avatarURL}/></figure>}

           <CustomUploadButton
              accept="image/*"
              name="avatar"
              randomizeFilename
              storageRef={firebase.storage().ref('user_images')}
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

