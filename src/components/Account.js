import React from 'react';
import * as db from '../db';
import firebase from "firebase";


export default class Account extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      avatarURL: ""
    };
  }
  componentDidMount() {
    firebase.storage().ref("user_images")
      .child(db.userData().image_name)
      .getDownloadURL()
      .then(url => this.setState({ avatarURL: url }));
  }

  deleteProfile = () => {
    if (!confirm('Are your sure? This will delete you data forever')) return;

    db.deleteProfile()
    .then(() => this.props.history.push('/'))
    .catch(console.error);
  }

  render() {
    const user = db.getUser();
    
    return (
      	<div className = "columns is-centered has-text-centered">
	      	<div className= "column is-two-fifths">
		      	<div className = "card">
			        <h1 className="is-size-1">Account</h1>
              <figure className="image is-128x128"><img className="is-rounded" src={this.state.avatarURL}/></figure>
			        <label className="label">Display Name</label>
			        <p>{user.displayName}</p>
			        <br/>
			    </div>
		        <button onClick={this.deleteProfile} className="button is-danger">Delete your Account</button>
		    </div>
		</div>
    );
  }
}
