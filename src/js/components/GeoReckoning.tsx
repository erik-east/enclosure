import * as React from 'react';

import MapComponent from './MapComponent';

const GeoReckoning: React.FC = (): JSX.Element => {
	const render = (): JSX.Element => {
		return (
			<div id='geo-reckoning-container'>
				<MapComponent />
			</div>
		);
	};

	return render();
};

export default GeoReckoning;
