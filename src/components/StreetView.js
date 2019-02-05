import React from 'react';

import { encodeQuery } from '../utils';
import { LazyImg } from './misc';


const GMAPS_TOKEN = 'AIzaSyB7Y8NG-Wqd1DxWzM1ta8U_jDzi3ITiNPk';

export default class StreetView extends React.PureComponent {
  render() {
    const { listing } = this.props;
    const pos = listing.position.geopoint;

    const query = {
      key: GMAPS_TOKEN,
      location: `${pos.latitude},123${pos.longitude}`,
      size: '400x300',
    };
    const src = `https://maps.googleapis.com/maps/api/streetview?${encodeQuery(query)}`;

    return (
      <LazyImg src={src} style={{ height: 180, background: '#eee' }}/>
    );
  }
}
