/* eslint-disable no-console */
import * as turf from '@turf/turf';
import * as React from 'react';
import { useParams } from 'react-router-dom';

import { MULTI_POLYGON_STATES } from '../constants/MULTI_POLYGON_STATES';
import { SINGLE_POLYGON_STATES } from '../constants/SINGLE_POLYGON_STATES';

import DrawingTools, { drawRef }  from './DrawingTools';

import 'mapbox-gl/dist/mapbox-gl.css';

const singlePolygonStates = Object.entries(SINGLE_POLYGON_STATES);
const multiPolygonStates = Object.entries(MULTI_POLYGON_STATES);

const PolygonGame: React.FC = (): JSX.Element => {
	const [ finalScore, setFinalScore ] = React.useState(-1);
	const [ isDrawing, setIsDrawing ] = React.useState(false);
	const [ polygons, setPolygons ] = React.useState({});
	const [ targetCount, setTargetCount ] = React.useState(0);
	const [ targetState, setTargetState ] = React.useState('');
	const [ targetPolygon, setTargetPolygon ] = React.useState();
	const [ userPolygon, setUserPolygon ] = React.useState();
	const { id } = useParams();

	const incrementTargetCount = () => setTargetCount(targetCount + 1);

	const determineResults = () => {
		const intersection: any = userPolygon && turf.intersect(userPolygon, targetPolygon);

		if (intersection === null) {
			const deadWrong: any = targetPolygon;

			deadWrong.properties = { class_id: 2 };
			drawRef?.deleteAll().add(deadWrong);
			setFinalScore(0);
			setIsDrawing(false);
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
	};

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

	const prepareNewTarget = () => {
		const statesCount = singlePolygonStates.length + multiPolygonStates.length;
		const randomStateIndex = Math.floor(Math.random() * statesCount);

		for (let i = 0; i < singlePolygonStates.length; i++) {
			if (i === randomStateIndex) {
				const [ key, value ] = singlePolygonStates[ i ];
				const singlePolygon: any = turf.polygon(value);

				setTargetPolygon(singlePolygon);
				setTargetState(key.toLowerCase().replace(/_/g, ' '));
				singlePolygonStates.splice(i, 1);
				break;
			}
		}

		for (let i = singlePolygonStates.length; i < statesCount; i++) {
			if (i === randomStateIndex) {
				const multiPolygonIndex = i - singlePolygonStates.length;
				const [ key, value ] = multiPolygonStates[ multiPolygonIndex ];
				const multiPolygon: any = turf.multiPolygon(value);

				setTargetPolygon(multiPolygon);
				setTargetState(key.toLowerCase().replace(/_/g, ' '));
				multiPolygonStates.splice(multiPolygonIndex, 1);
				break;
			}
		}
	};

	const resetTarget = () => {
		drawRef?.deleteAll();
		setFinalScore(-1);
		setPolygons({});
		setUserPolygon(undefined);
	};

	React.useEffect(() => {
		incrementTargetCount();
		prepareNewTarget();
		console.log(id);
	}, [ ]);

	React.useEffect(() => {
		if (polygons && Object.keys(polygons).length === 1) {
			const firstPolygon = polygons[ Object.keys(polygons)[ 0 ] ];

			setUserPolygon(firstPolygon);
		}
	}, [ polygons ]);

	React.useEffect(() => {
		if (!userPolygon) {
			return;
		}

		determineResults();
	}, [ userPolygon ]);

	React.useEffect(() => {
		if (targetCount > 1) {
			resetTarget();
			prepareNewTarget();
			onDrawStart();
		}
	}, [ targetCount ]);

	return (
		<>
			<DrawingTools
				onCreate={ onDrawUpdate }
				onDelete={ onDrawDelete }
				onUpdate={ onDrawUpdate } />

			<div className='target-state'>{ targetState }</div>

			{
				finalScore >= 0 && !isDrawing && <>
					<div className='final-score'>{ finalScore } / 50000</div>
					<button className='next' onClick={ incrementTargetCount }>Keep Drawing!</button>
				</>
			}

			{
				!isDrawing && !userPolygon && <button className='start' onClick={ onDrawStart }>Start Drawing!</button>
			}
		</>
	);
};

export default PolygonGame;
