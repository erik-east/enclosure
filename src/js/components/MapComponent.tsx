import * as React from 'react';
import { Map } from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWVya2trIiwiYSI6ImNsM20zYTdqYzAwcDQzZ211MjlvdnlwaTUifQ.8jCiZU-Ii4F5GY6GpOBW_g';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9';

const MapComponent: React.FC = (): JSX.Element => {
	const mapRef = React.useRef();
	const [ viewState, setViewState ] = React.useState({
		latitude: 38,
		longitude: 35,
		zoom: 5
	});

	const render = (): JSX.Element => {
		return (
			<div className='mapbox'>
				<Map
					{ ...viewState }
					dragRotate={ false }
					id='mapbox'
					mapboxAccessToken={ MAPBOX_ACCESS_TOKEN }
					mapStyle={ MAPBOX_STYLE }
					onMove={ (e) => setViewState(e.viewState) }
					ref={ mapRef }
					renderWorldCopies />
			</div>
		);
	};

	return render();
};

export default MapComponent;
