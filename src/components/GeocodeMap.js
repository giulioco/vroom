import React, { Component } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
// import DeckGL, { GeoJsonLayer } from 'deck.gl';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2Fpb2JhcmIiLCJhIjoiY2pyM3pqamwyMThsaTQ2cWxrNjlvMm9tbSJ9.JrUUH2OmqsbmlKedxW-l2g';


export default class GeocodeMap extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8,
    },
  };

  mapRef = React.createRef();

  componentDidCatch(error) {
    console.error(error);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  handleViewportChange = viewport => {
    this.setState(({ viewport: pastViewport }) => ({
      viewport: { ...pastViewport, ...viewport },
    }));
  };

  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides,
    });
  };

  handleOnResult = (event) => {
    console.log(event.result.center);
    this.setState({
      coords: event.result.geometry.coordinates,
      name: event.result.place_name,
    });
  };

  render() {
    const { viewport, coords, name } = this.state;

    return <>
      <MapGL
        ref={this.mapRef}
        {...viewport}
        onViewportChange={this.handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}>
        <Geocoder
          mapRef={this.mapRef}
          onResult={this.handleOnResult}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
        />
        {coords ? (
          <Marker longitude={coords[0]} latitude={coords[1]} className="mymarker" >
            <p>asdsada</p>
          </Marker>
        ) : null}
        {/* <DeckGL {...viewport} layers={[searchResultLayer]} /> */}
      </MapGL>
      { name && <p><strong>{name}</strong></p> }
    </>;
  }
}
