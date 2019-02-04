import React, { Component } from 'react';
import ReactStreetview from 'react-streetview';

;

export default class StreetView extends Component {

    render() {
        const GMAPS_TOKEN = 'AIzaSyB7Y8NG-Wqd1DxWzM1ta8U_jDzi3ITiNPk'
        const { listing } = this.props;
        const pos =  listing.position.geopoint;
        const streetViewPanoramaOptions = {
			position: {lat: pos.latitude, lng: pos.longitude},
			pov: {heading: 100, pitch: 0},
			zoom: 1
        };
        
        return (
            <div style={{
				width: 'auto',
				height: '200px',
				backgroundColor: '#eeeeee'
			}}>
				<ReactStreetview
					apiKey={GMAPS_TOKEN}
					streetViewPanoramaOptions={streetViewPanoramaOptions}
				/>
			</div>
        )
    }

}