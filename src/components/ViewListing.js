import React from 'react';
import { Route, Link } from 'react-router-dom';

import * as db from '../db';
import { thisExpression } from 'babel-types';


export default class ViewListing extends React.Component {

  state = {
    data: null
  }

  componentDidMount() {
    // this.props.match.params.id
    db.listings.doc('Bld0KE7qwR6a4Eq1DhAC').get().then((doc) => {
      if (doc.exists) {
        var docData = doc.data()
        console.log(docData)
        this.setState({ data: docData })
        // this.state = {
        //   docExist: true,
        //   docData
        // }

      } else {
        console.log("The Listing you are looking for does not exist")
        this.setState({ data: null })
        // this.state = {
        //   docExist: false
        // }
      }

    })
  }

  render() {
    // const { name } = this.props.data;


    if (this.state.data != null) {
      return (
        <div>
          <h1>View listing {this.props.match.params.id}</h1>
        </div>
      );
    } else {
      return (
        <div>
          <h1>The listing you are looking for does not exist</h1>

        </div>
      );
    }

  }
}
