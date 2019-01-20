import React from 'react';
import { Route, Link } from 'react-router-dom';

import mapbox from 'mapbox-gl';
import GeocodeMap from './GeocodeMap';

// import MapGL, {NavigationControl} from 'react-map-gl';


// const TOKEN = 'pk.eyJ1Ijoia2Fpb2JhcmIiLCJhIjoiY2pyM3pqamwyMThsaTQ2cWxrNjlvMm9tbSJ9.JrUUH2OmqsbmlKedxW-l2g';
// mapbox.accessToken = TOKEN;

export default class MapDisplay extends React.Component {

  // componentDidMount() {

  //   this.map = new mapbox.Map({
  //     container: this.container.current,
  //     style: 'mapbox://styles/mapbox/dark-v9',
  //     // viewport: {
  //       latitude: 37.785164,
  //       longitude: -100,
  //       zoom: 2.8,
  //       bearing: 0,
  //       pitch: 0,
  //       width: 500,
  //       height: 500,
  //     // },
  //   });
  // }

  // componentWillUnmount() {
  //   if (this.map) this.map.remove();
  // }

  // container = React.createRef();

  render() {

    return (
      <div>
        <h1>PUT MAP HERE</h1>
        {/* <div ref={this.container}/> */}
        <GeocodeMap/>
      </div>
    );
  }
}
