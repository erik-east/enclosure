import * as React from 'react';

import MapComponent from './MapComponent';

const GeoReckoning: React.FC = (): JSX.Element => {
	return (
		<div id='geo-reckoning-container'>
			<MapComponent />
		</div>
	);
};

export default GeoReckoning;
