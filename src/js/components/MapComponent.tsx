import * as React from 'react';
import { Map } from 'react-map-gl';
import { Outlet, useParams } from 'react-router-dom';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWVya2trIiwiYSI6ImNsM20zYTdqYzAwcDQzZ211MjlvdnlwaTUifQ.8jCiZU-Ii4F5GY6GpOBW_g';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9';

const MapComponent: React.FC = (): JSX.Element => {
	const mapRef = React.useRef();
	const { content } = useParams();
	const [ viewState, setViewState ] = React.useState({
		latitude: content === 'us-states' ? 36 : 55,
		longitude: content === 'us-states' ? -98 : 15,
		zoom: content === 'us-states' ? 3.5 : 3.75
	});

	return (
		<div className='mapbox'>
			<Map
				{ ...viewState }
				dragRotate={ false }
				id='mapbox'
				mapboxAccessToken={ MAPBOX_ACCESS_TOKEN }
				mapStyle={ MAPBOX_STYLE }
				minZoom={ 2.5 }
				onMove={ (e) => setViewState(e.viewState) }
				ref={ mapRef }
				renderWorldCopies>
				<Outlet />
			</Map>
		</div>
	);
};

export default MapComponent;
