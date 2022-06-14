/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as turf from '@turf/turf';
import * as React from 'react';
import { Map } from 'react-map-gl';

import { MULTI_POLYGON_STATES } from '../constants/MULTI_POLYGON_STATES';
import { SINGLE_POLYGON_STATES } from '../constants/SINGLE_POLYGON_STATES';

import DrawingTools, { drawRef }  from './DrawingTools';

import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWVya2trIiwiYSI6ImNsM20zYTdqYzAwcDQzZ211MjlvdnlwaTUifQ.8jCiZU-Ii4F5GY6GpOBW_g';
const MAPBOX_STYLE = 'mapbox://styles/mapbox/satellite-v9';
const multiPolygonTexas = turf.multiPolygon(MULTI_POLYGON_STATES.TEXAS);

const MapComponent: React.FC = (): JSX.Element => {
	const mapRef = React.useRef();
	const [ viewState, setViewState ] = React.useState({
		latitude: 36,
		longitude: -98,
		zoom: 3.5
	});
	const [ finalScore, setFinalScore ] = React.useState(-1);
	const [ isDrawing, setIsDrawing ] = React.useState(false);
	const [ polygons, setPolygons ] = React.useState({});
	const [ targetState, setTargetState ] = React.useState('');
	const [ targetPolygon, setTargetPolygon ] = React.useState();
	const [ userPolygon, setUserPolygon ] = React.useState();

	const singlePolygonStates = Object.entries(SINGLE_POLYGON_STATES);
	const multiPolygonStates = Object.entries(MULTI_POLYGON_STATES);
	const statesCount = singlePolygonStates.length + multiPolygonStates.length;

	const onDrawDelete = React.useCallback((draw) => {
		setPolygons((currentFeatures) => {
			const newFeatures = { ...currentFeatures };

			for (const feature of draw.features) {
				delete newFeatures[ feature.id ];
			}

			return newFeatures;
		});
	}, [ ]);

	const onDrawStart = () => {
		drawRef?.changeMode('draw_polygon');
		setIsDrawing(true);
	};

	const onDrawUpdate = React.useCallback((draw) => {
		setPolygons((currentFeatures) => {
			const newFeatures = { ...currentFeatures };

			for (const feature of draw.features) {
				newFeatures[ feature.id ] = feature;
			}

			return newFeatures;
		});

		setIsDrawing(false);
	}, [ ]);

	React.useEffect(() => {
		const randomStateIndex = Math.floor(Math.random() * statesCount);

		for (let i = 0; i < singlePolygonStates.length; i++) {
			if (i === randomStateIndex) {
				const [ key, value ] = singlePolygonStates[ i ];
				const singlePolygon: any = turf.polygon(value);

				setTargetPolygon(singlePolygon);
				setTargetState(key.toLowerCase().replace(/_/g, ' '));
			}
		}

		for (let i = singlePolygonStates.length; i < statesCount; i++) {
			if (i === randomStateIndex) {
				const [ key, value ] = multiPolygonStates[ i - singlePolygonStates.length ];
				const multiPolygon: any = turf.multiPolygon(value);

				setTargetPolygon(multiPolygon);
				setTargetState(key.toLowerCase().replace(/_/g, ' '));
			}
		}
	}, [ ]);

	React.useEffect(() => {
		if (polygons && Object.keys(polygons).length === 1) {
			console.log(polygons);
			// eslint-disable-next-line prefer-destructuring
			const firstPolygon: any = Object.values(polygons)[ 0 ];

			setUserPolygon(firstPolygon);
		}
	}, [ polygons ]);

	React.useEffect(() => {
		console.log('all polygons:', polygons);

		if (!userPolygon) {
			return;
		}

		console.log('userPolygon:', userPolygon);
		console.log('targetPolygon:', targetPolygon);
		const intersection: any = userPolygon && turf.intersect(userPolygon, targetPolygon);

		console.log(intersection);

		if (intersection === null) {
			const deadWrong: any = targetPolygon;

			deadWrong.properties = { class_id: 2 };
			drawRef?.deleteAll().add(deadWrong);
		}

		if (intersection) {
			const outlierArea = turf.difference(userPolygon, intersection);

			outlierArea.properties = { class_id: 3 };

			drawRef?.deleteAll().add(outlierArea);

			intersection.properties = { class_id: 1 };
			drawRef?.add(intersection);

			const intersectionArea = turf.convertArea(turf.area(intersection), 'meters', 'miles');
			const targetArea = turf.convertArea(turf.area(targetPolygon), 'meters', 'miles');
			const drawnArea = turf.convertArea(turf.area(userPolygon), 'meters', 'miles');

			console.log('area of intersection:', intersectionArea);
			console.log('total area of Texas:', targetArea);
			console.log('area of drawn polygon:', drawnArea);

			const maximumScore = 50000;
			const baseMultiplier = intersectionArea / targetArea;
			const drawAccuracy = 1 - ((drawnArea - intersectionArea) / drawnArea);
			// Penalty multiplier for draw accuracy is less forgiving if you overshoot more than 5 percent of target area
			const penaltyMultiplier = drawnArea > (targetArea * 1.05) ? drawAccuracy * 0.8 : drawAccuracy;
			const finalScore = maximumScore * baseMultiplier * penaltyMultiplier;

			setFinalScore(Number(finalScore.toFixed(0)));

			console.log('base multiplier:', baseMultiplier.toFixed(2));
			console.log('penalty multiplier:', penaltyMultiplier.toFixed(2));
			console.log('final score:', finalScore.toFixed(0), '/ 50000');

			const difference = turf.difference(targetPolygon, intersection);

			if (difference) {
				difference.properties = { class_id: 2 };
				drawRef?.add(difference);
			}
		}
	}, [ userPolygon ]);

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
				<DrawingTools
					initialPolygon={ multiPolygonTexas }
					onCreate={ onDrawUpdate }
					onDelete={ onDrawDelete }
					onUpdate={ onDrawUpdate } />
				<div className='target-state'>{ targetState }</div>

				{
					userPolygon && !isDrawing && <>
						<div className='final-score'>{ finalScore } / 50000</div>
						<button className='next' onClick={ () => console.log('Next game starts') }>Keep Drawing!</button>
					</>
				}

				{
					!isDrawing && !userPolygon && <button className='start' onClick={ onDrawStart }>Start Drawing!</button>
				}
			</Map>
		</div>
	);
};

export default MapComponent;
