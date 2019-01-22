import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import { EventEmitter } from 'events';


const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2Fpb2JhcmIiLCJhIjoiY2pyM3pqamwyMThsaTQ2cWxrNjlvMm9tbSJ9.JrUUH2OmqsbmlKedxW-l2g';


const req = new EventEmitter();

export default class SearchAddress extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentDidCatch() {
    // These maps throw errors. Catch them then throw them away!
  }

  mapRef = React.createRef();
  containerRef = React.createRef();

  onResultAddress = (event) => {
    req.emit('filled');

    this.props.onResult({
      coords: event.result.center,
      address: event.result.place_name,
    });
  }

  render() {
    const { required } = this.props;

    return <>
      <div className="search-address" ref={this.containerRef}>
        <MapGL
          ref={this.mapRef}
          width={1}
          height={1}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <Geocoder
            mapRef={this.mapRef}
            containerRef={this.containerRef}
            onResult={this.onResultAddress}
            onViewportChange={() => {}}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
          />
        </MapGL>
      </div>
      { required && <FakeRequired required={required}/> }
    </>;
  }
}

class FakeRequired extends React.Component {
  
  state = {
    filled: false,
  }

  componentDidMount() {
    req.once('filled', this.onFilled);
  }

  onFilled = () => this.setState({ filled: true })

  render() {
    const { filled } = this.state;

    return (
      <input type="text" className="input-hidden" required
        name="_" value={filled ? '_' : ''} onChange={() => {}}/>
    );
  }
}
