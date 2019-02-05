import React from 'react';
import 'react-firebase-file-uploader';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

import * as db from '../db';
import { LazyImg, Spinner } from './misc';


export default class Setup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: db.getUser().displayName,
      // license_verification: false,
      avatarURL: null,
      change: false,
    };
  }

  componentDidMount() {
    this.userId = db.getUser().uid;

    this.image_name = db.userData().image_name;
    if (this.image_name) {
      db.images
      .child(this.image_name)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }))
      .catch(console.error);
    }
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value, change: true });
  }

  handleUploadStart = () => this.setState({ isUploading: true, avatarURL: null });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.image_name = filename;
    this.setState({ isUploading: false, change: true });
    
    db.images
    .child(filename)
    .getDownloadURL()
    .then(url => this.setState({ avatarURL: url }))
    .catch(console.error);
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { name } = this.state;

    db.setupAccount({
      name,
      image_name: this.image_name,
      setup: true,
      email: db.getUser().email,
    })
    .then(() => {
      if (this.props.setup)
        this.props.history.push('/dashboard');
      else
        this.setState({ change: false });
    });
  }

  render() {
    const { isUploading, avatarURL, change, name } = this.state;
    const { setup } = this.props;

    return (
      <section className="section">
        <form onSubmit={this.handleSubmit} className="container">
          <h1 className="is-size-1">{setup ? 'Account Setup' : 'Account'}</h1>
          <br/>

          <div className="columns">
            <div className="column is-6">
              <div className="field">
                <label className="label">Display Name</label>
                <div className="control">
                  <input className="input" type="text" value={name} required onChange={this.handleChange} />
                </div>
              </div>

              <div className="field">
                <label className="label">ID Verification</label>
                <div className="control">
                  <input className="input" type="text" defaultValue="This feature is not yet implemented" disabled/>
                </div>
              </div>
            </div>
            <div className="column is-5 is-offset-1">
              <div className="field">
                <label className="label">Profile Picture</label>
                <LazyImg src={isUploading ? null : avatarURL} className="shadowed"
                  style={{ height: 256, width: 256, background: 'white' }} placeholder={<Spinner fullPage/>}/>
                <br/>
                <CustomUploadButton
                  accept="image/*"
                  name="avatar"
                  filename={this.userId}
                  storageRef={db.images}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  disabled={isUploading}
                  className="button">
                  Select Image
                </CustomUploadButton>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success" disabled={!change}>Save</button>
            </div>
          </div>
        </form>
      </section>
    );
  }
}
