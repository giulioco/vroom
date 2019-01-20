import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2Fpb2JhcmIiLCJhIjoiY2pyM3pqamwyMThsaTQ2cWxrNjlvMm9tbSJ9.JrUUH2OmqsbmlKedxW-l2g';


export default class SearchAddress extends Component {

  mapRef = React.createRef();
  containerRef = React.createRef();

  handleGeocoderViewportChange = () => {
  };

  componentDidCatch(error) {
    console.error(error);
  }

  onResultAddress = (event) => {
    console.log("djkde")
    this.props.onResult({
      coords: event.result.center,
      address: event.result.place_name,
    });
  };

  render() {

    return (
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
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
          />
        </MapGL>
      </div>
    );
  }
}
