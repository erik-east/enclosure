/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as turf from '@turf/turf';
import * as React from 'react';
import { Map } from 'react-map-gl';

import { BOUNDARIES } from '../constants/BOUNDARIES';

import DrawingTools, { drawRef }  from './DrawingTools';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWVya2trIiwiYSI6ImNsM20zYTdqYzAwcDQzZ211MjlvdnlwaTUifQ.8jCiZU-Ii4F5GY6GpOBW_g';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9';
const texasPolygon = turf.polygon(BOUNDARIES.TEXAS);

const MapComponent: React.FC = (): JSX.Element => {
	const mapRef = React.useRef();
	const [ viewState, setViewState ] = React.useState({
		latitude: 32,
		longitude: -98,
		zoom: 4
	});
	const [ polygons, setPolygons ] = React.useState({});

	const onDrawDelete = React.useCallback((draw) => {
		setPolygons((currentFeatures) => {
			const newFeatures = { ...currentFeatures };

			for (const feature of draw.features) {
				delete newFeatures[ feature.id ];
			}

			return newFeatures;
		});
	}, [ ]);

	const onDrawUpdate = React.useCallback((draw) => {
		setPolygons((currentFeatures) => {
			const newFeatures = { ...currentFeatures };

			for (const feature of draw.features) {
				newFeatures[ feature.id ] = feature;
			}

			return newFeatures;
		});
	}, [ ]);

	React.useEffect(() => {
		console.log('all polygons:', polygons);
		const firstPolygon: any = Object.values(polygons)[ 0 ];

		console.log('firstPolygon:', firstPolygon);
		const intersection = firstPolygon && turf.intersect(firstPolygon, texasPolygon);

		if (intersection) {
			intersection.properties = { class_id: 1 };
			drawRef?.add(intersection);

			const intersectionArea = turf.convertArea(turf.area(intersection), 'meters', 'miles');
			const targetArea = turf.convertArea(turf.area(texasPolygon), 'meters', 'miles');
			const drawnArea = turf.convertArea(turf.area(firstPolygon), 'meters', 'miles');

			console.log('area of intersection:', intersectionArea);
			console.log('total area of Texas:', targetArea);
			console.log('area of drawn polygon:', drawnArea);

			const maximumScore = 50000;
			const baseMultiplier = intersectionArea / targetArea;
			const drawAccuracy = 1 - ((drawnArea - intersectionArea) / drawnArea);
			// Penalty multiplier for draw accuracy is less forgiving if you overshoot more than 5 percent of target area
			const penaltyMultiplier = drawnArea > (targetArea * 1.05) ? drawAccuracy * 0.8 : drawAccuracy;
			const finalScore = maximumScore * baseMultiplier * penaltyMultiplier;

			console.log('base multiplier:', baseMultiplier.toFixed(2));
			console.log('penalty multiplier:', penaltyMultiplier.toFixed(2));
			console.log('final score:', finalScore.toFixed(0), '/ 50000');

			const difference = turf.difference(texasPolygon, intersection);

			if (difference) {
				difference.properties = { class_id: 2 };
				drawRef?.add(difference);
			}
		}
	}, [ polygons ]);

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
				renderWorldCopies>
				<DrawingTools
					initialPolygon={ texasPolygon }
					onCreate={ onDrawUpdate }
					onDelete={ onDrawDelete }
					onUpdate={ onDrawUpdate } />
			</Map>
		</div>
	);
};

export default MapComponent;
