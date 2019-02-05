import React from 'react';
// import ReactStreetview from 'react-streetview';

import { encodeQuery } from '../utils';
import { LazyImg } from './misc';


const GMAPS_TOKEN = 'AIzaSyB7Y8NG-Wqd1DxWzM1ta8U_jDzi3ITiNPk';

export default class StreetView extends React.PureComponent {
  render() {
    const { listing } = this.props;
    const pos = listing.position.geopoint;

    const query = {
      key: GMAPS_TOKEN,
      location: `${pos.latitude},${pos.longitude}`,
      size: '400x300',
    };
    const src = `https://maps.googleapis.com/maps/api/streetview?${encodeQuery(query)}`;

    return (
      // <div style={{ width: 'auto', height: 180, background: '#eee' }}>
      //   <ReactStreetview apiKey={GMAPS_TOKEN} streetViewPanoramaOptions={{
      //     position: { lat: pos.latitude, lng: pos.longitude },
      //     pov: { heading: 100, pitch: 0 },
      //     zoom: 1,
      //   }}/>
      // </div>
      <LazyImg src={src} style={{ height: 180, background: '#eee' }}/>
    );
  }
}
