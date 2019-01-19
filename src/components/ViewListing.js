import React from 'react';
import { Route, Link } from 'react-router-dom';

import * as db from '../db';


export default class Listing extends React.Component {

  render() {
    const { name } = this.props.data;

    return (
      <div>
        <h1>View listing</h1>
        
      </div>
    );
  }
}
