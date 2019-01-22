import React, { Component } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import { Link } from 'react-router-dom';

const MAPBOX_TOKEN = 'pk.eyJ1Ijoia2Fpb2JhcmIiLCJhIjoiY2pyM3pqamwyMThsaTQ2cWxrNjlvMm9tbSJ9.JrUUH2OmqsbmlKedxW-l2g';


export default class GeocodeMap extends Component {

  state = {
    viewport: {
      width: 400,
      height: 400,
      latitude: 37.774929,
      longitude: -122.419418,
      zoom: 11,
    },
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();

    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords: { longitude, latitude } }) => this.setCoords(latitude, longitude), console.error);
    }
  }

  componentDidCatch(error) {
    console.error('MapError', error);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  mapRef = React.createRef();
  containerRef = React.createRef();

  setCoords(latitude, longitude) {
    this.setState(({ viewport }) => ({ viewport: { ...viewport, longitude, latitude } }), () => {
      this.props.onResult({ coords: [latitude, longitude] });
    });
  }

  resize = () => {
    this.handleViewportChange({
      width: this.containerRef.current.offsetWidth,
      height: this.containerRef.current.offsetHeight - 1, // just got to
    });
  }

  handleViewportChange = viewport => {
    this.setState(({ viewport: pastViewport }) => ({
      viewport: { ...pastViewport, ...viewport },
    }), () => this.props.onResult({ coords: [this.state.viewport.latitude, this.state.viewport.longitude] }));
  };

  handleGeocoderViewportChange = viewport => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides,
    });
  };

  handleOnResult = (event) => {
    this.address = event.result.place_name;

    const [long, lat] = event.result.center;
    this.setCoords(lat, long);
  };

  render() {
    const { viewport } = this.state;
    const { listings, radius } = this.props;

    const { latitude, longitude } = viewport;

    return (
      <div ref={this.containerRef} style={{ flex: 1 }}>
        <MapGL
          ref={this.mapRef}
          {...viewport}
          mapStyle="mapbox://styles/mapbox/dark-v9"
          onViewportChange={this.handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}>
          <Geocoder
            mapRef={this.mapRef}
            onResult={this.handleOnResult}
            onViewportChange={this.handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            position="top-left"
          />
          <DeckGL {...viewport} layers={[
            new ScatterplotLayer({
              data: [
                { position: [longitude, latitude] },
              ],
              getPosition: d => d.position,
              getRadius: radius * 1000,
              stroked: true,
              getColor: [255, 255, 255, 50],
              pickable: false,
            }),
          ]}/>
          {listings.map((listing) => {
            const pos = listing.position.geopoint;
            return (
              <Marker key={listing.id} latitude={pos.latitude} longitude={pos.longitude}>
                <Link className="map-user" to={`/listings/${listing.id}`} title={listing.rate + ' $/day'}/>
              </Marker>
            );
          })}
        </MapGL>
      </div>
    );
  }
}
