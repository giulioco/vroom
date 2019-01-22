import React from 'react';
import "react-firebase-file-uploader";
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

import * as db from '../db';


export default class Setup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: db.getUser().displayName,
      // license_verification: false,
      avatar: '',
    };
  }

  componentDidMount() {
    const image = db.userData().image_name;
    if (image) {
      db.images
      .child(image)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }))
      .catch(console.error);
    }
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
    
    db.images
    .child(filename)
    .getDownloadURL()
    .then(url => this.setState({ avatarURL: url }));
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { name, avatar } = this.state;

    db.setupAccount({
      name,
      image_name: avatar,
      setup: true,
      email: db.getUser().email,
    })
    .then(() => this.props.history.push('/dashboard'));
  }

  render() {
    const { isUploading, avatarURL, progress } = this.state;
    
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
          {isUploading && <p> <progress className="progress is-success" value={progress} max="100">{progress}%</progress></p>}
          {avatarURL && <figure className="image is-128x128"><img src={avatarURL}/></figure>}

          <CustomUploadButton
            accept="image/*"
            name="avatar"
            randomizeFilename
            storageRef={db.images}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
            className="button is-link">
            Select Image
          </CustomUploadButton>
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
