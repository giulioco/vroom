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
      zoom: 11,
    },
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentDidCatch(error) {
    console.error(error);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.center && (props.center[0] !== state.viewport.latitude || props.center[1] !== state.viewport.longitude)) {
  //     return {
  //       viewport: {
  //         ...state.viewport,
  //         latitude: props.center[0],
  //         longitude: props.center[1],
  //       },
  //     };
  //   }
  //   return null;
  // }

  mapRef = React.createRef();
  containerRef = React.createRef();

  resize = () => {
    this.handleViewportChange({
      width: this.containerRef.current.offsetWidth,
      height: this.containerRef.current.offsetHeight - 2, // just got to
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
    const [long, lat] = event.result.center;
    this.props.onResult({
      coords: [lat, long],
      name: event.result.place_name,
    });
  };

  render() {
    const { viewport } = this.state;
    const { listings, radius, center } = this.props;

    if (center) {
      viewport.latitude = center[0];
      viewport.longitude = center[1];
    }

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
          { center && (
            <DeckGL {...viewport} layers={[
              new ScatterplotLayer({
                data: [
                  { position: [center[1], center[0]] },
                ],
                getPosition: d => d.position,
                getRadius: radius * 1000,
                stroked: true,
                getColor: [255, 255, 255, 50],
                pickable: false,
              }),
            ]}/>
          )}
          {listings.map((listing) => {
            const pos = listing.position.geopoint;
            return (
              <Marker key={listing.id} latitude={pos.latitude} longitude={pos.longitude}>
                <span>TEST</span>
                <Link className="map-user" to={`/listings/${listing.id}`}/>
              </Marker>
            );
          })}
        </MapGL>
      </div>
    );
  }
}
