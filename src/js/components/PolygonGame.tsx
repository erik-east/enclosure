/* eslint-disable no-console */
import * as turf from '@turf/turf';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MULTI_POLYGON_STATES } from '../constants/MULTI_POLYGON_STATES';
import { SINGLE_POLYGON_STATES } from '../constants/SINGLE_POLYGON_STATES';

import DrawingTools, { drawRef }  from './DrawingTools';

import 'mapbox-gl/dist/mapbox-gl.css';

const singlePolygonStates = Object.entries(SINGLE_POLYGON_STATES);
const multiPolygonStates = Object.entries(MULTI_POLYGON_STATES);
const maximumScore = 9999;

const PolygonGame: React.FC = (): JSX.Element => {
	const [ finalScore, setFinalScore ] = React.useState(-1);
	const [ totalFinalScore, setTotalFinalScore ] = React.useState(0);
	const [ didGameEnd, setDidGameEnd ] = React.useState(false);
	const [ showResults, setShowResults ] = React.useState(false);
	const [ isDrawing, setIsDrawing ] = React.useState(false);
	const [ polygons, setPolygons ] = React.useState({});
	const [ targetCount, setTargetCount ] = React.useState(1);
	const [ targetState, setTargetState ] = React.useState('');
	const [ targetPolygon, setTargetPolygon ] = React.useState();
	const [ userPolygon, setUserPolygon ] = React.useState();
	const navigate = useNavigate();
	const { content, id: totalTargetCount } = useParams();

	const incrementTargetCount = () => setTargetCount(targetCount + 1);
	const incrementTotalFinalScore = (finalScore) => setTotalFinalScore(totalFinalScore + Number(finalScore));

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
			const baseMultiplier = intersectionArea / targetArea;
			const drawAccuracy = 1 - ((drawnArea - intersectionArea) / drawnArea);
			// Penalty multiplier for draw accuracy is less forgiving if you overshoot more than 5 percent of target area
			const penaltyMultiplier = drawnArea > (targetArea * 1.05) ? drawAccuracy * 0.8 : drawAccuracy;
			const finalScore = maximumScore * baseMultiplier * penaltyMultiplier;

			setFinalScore(Number(finalScore.toFixed(0)));
			incrementTotalFinalScore(Number(finalScore.toFixed(0)));

			// TODO: Add these to the score sheet
			console.log('base multiplier:', baseMultiplier.toFixed(2));
			console.log('penalty multiplier:', penaltyMultiplier.toFixed(2));

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

	const restartGame = () => {
		resetTarget();
		setTotalFinalScore(0);
		setDidGameEnd(false);
		setShowResults(false);
		setIsDrawing(false);
		setTargetCount(1);
		setTargetState('');
		setTargetPolygon(undefined);

		prepareNewTarget();
	};

	const resetTarget = () => {
		drawRef?.deleteAll();
		setFinalScore(-1);
		setPolygons({});
		setUserPolygon(undefined);
	};

	const renderMenu = () => {
		if (showResults) {
			return (
				<div className='menu'>
					<div className='title'>Final Score</div>
					<div className='total-score'>{ totalFinalScore } / { maximumScore * Number(totalTargetCount) } </div>
				</div>
			);
		}

		return (
			<div className='menu'>
				<div className='current-state'>
					<span>{ targetState }</span>
					<span className='count'>{ targetCount } / { totalTargetCount }</span>
				</div>

				{ finalScore >= 0 && <div className='final-score'><span>Score:</span> { finalScore } / { maximumScore }</div> }
			</div>
		);
	};

	React.useEffect(() => {
		if (!content || content !== 'us-states') {
			navigate('game');
		}

		if ((!totalTargetCount || Number(totalTargetCount) < 1 || Number(totalTargetCount) > 50)) {
			navigate(`game/${content}`);
		}

		prepareNewTarget();
	}, [ ]);

	React.useEffect(() => {
		if (userPolygon && targetCount === Number(totalTargetCount)) { // TODO: Change this when user can add multiple polygons
			setDidGameEnd(true);
		}
	}, [ finalScore ]);

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
		<div className='polygon-game'>
			<DrawingTools
				onCreate={ onDrawUpdate }
				onDelete={ onDrawDelete }
				onUpdate={ onDrawUpdate } />

			{ renderMenu() }

			<div className='buttons'>
				{
					!isDrawing && !userPolygon && <button className='start' onClick={ onDrawStart }>Start Drawing!</button>
				}

				{
					finalScore >= 0 && !isDrawing && !didGameEnd &&
					<button className='next' onClick={ incrementTargetCount }>Keep Drawing!</button>
				}

				{
					didGameEnd && !showResults && <button className='show-results' onClick={ () => setShowResults(true) }>Show Results</button>
				}

				{
					showResults && <button className='restart' onClick={ () => restartGame() }>Restart Game</button>
				}
			</div>
		</div>
	);
};

export default PolygonGame;
