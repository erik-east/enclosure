/* eslint-disable no-console */
import * as turf from '@turf/turf';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { MULTI_POLYGON_STATES } from '../constants/MULTI_POLYGON_STATES';
import { SINGLE_POLYGON_STATES } from '../constants/SINGLE_POLYGON_STATES';
import { initializePolygons, randomUniqueIndices } from '../lib/util';

import DrawingTools, { drawRef }  from './DrawingTools';

import 'mapbox-gl/dist/mapbox-gl.css';

const maximumScore = 9999;
let statePolygons = initializePolygons(SINGLE_POLYGON_STATES, MULTI_POLYGON_STATES);

// TODO: Move to lib
const determineClueCount = (gameId: string) => {
	switch (gameId) {
		case 'easy':
			return 8;
		case 'medium':
			return 5;
		case 'hard':
			return 3;
		default:
			return 5;
	}
};

const PolygonGame: React.FC<{ clueMode?: boolean }> = ({ clueMode = false }): JSX.Element => {
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
	const [ cluePolygons, setCluePolygons ] = React.useState([]);
	const [ pastPolygons, setPastPolygons ] = React.useState([]);
	const navigate = useNavigate();
	const { content, id: gameId } = useParams();
	const totalTargetCount = (gameId === 'easy' || gameId === 'medium' || gameId === 'hard') ? 50 : gameId;
	const defaultClueCount = determineClueCount(gameId);

	const incrementTargetCount = () => setTargetCount(targetCount + 1);
	const incrementTotalFinalScore = (finalScore) => setTotalFinalScore(totalFinalScore + Number(finalScore));

	const addPastPolygon = (pastPolygon: any) => {
		setPastPolygons((array) => [ ...array, pastPolygon ]);
	};

	const determineResults = () => {
		const intersection: any = userPolygon && turf.intersect(userPolygon, targetPolygon);
		const pastPolygon: { difference: any; intersection: any; polygon: any } = { difference: null, intersection, polygon: targetPolygon };

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

			// TODO: Move to lib
			const intersectionArea = turf.convertArea(turf.area(intersection), 'meters', 'miles');
			const targetArea = turf.convertArea(turf.area(targetPolygon), 'meters', 'miles');
			const drawnArea = turf.convertArea(turf.area(userPolygon), 'meters', 'miles');
			const baseMultiplier = intersectionArea / targetArea;
			const drawAccuracy = 1 - ((drawnArea - intersectionArea) / drawnArea);
			// Penalty multiplier for draw accuracy is less forgiving if you overshoot more than 5 percent of target area
			const penaltyMultiplier = drawnArea > (targetArea * 1.05) ? drawAccuracy * 0.9 : drawAccuracy;
			const finalScore = maximumScore * baseMultiplier * penaltyMultiplier;

			setFinalScore(Number(finalScore.toFixed(0)));
			incrementTotalFinalScore(Number(finalScore.toFixed(0)));

			// TODO: Add these to the score sheet
			console.log('base multiplier:', baseMultiplier.toFixed(2));
			console.log('penalty multiplier:', penaltyMultiplier.toFixed(2));

			const difference = turf.difference(targetPolygon, intersection);

			if (difference) {
				console.log('difference', difference);
				difference.properties = { class_id: 2 };
				drawRef?.add(difference);
				pastPolygon.difference = difference;
			}
		}

		addPastPolygon(pastPolygon);
	};

	const displayCluePolygons = () => {
		if (cluePolygons && Object.keys(cluePolygons).length > 0) {
			const cluePolygonsLength = Object.keys(cluePolygons).length;

			for (let i = 0; i < cluePolygonsLength; i++) {
				const cluePolygon = cluePolygons[ i ];

				cluePolygon.properties = { class_id: 4 };
				drawRef?.add(cluePolygon);
			}
		}
	};

	const displayPastPolygons = () => {
		if (pastPolygons && Object.keys(pastPolygons).length > 0) {
			const pastPolygonsLength = Object.keys(pastPolygons).length;

			for (let i = 0; i < pastPolygonsLength; i++) {
				const { difference, intersection, polygon } = pastPolygons[ i ];

				if (intersection === null) {
					polygon.properties = { class_id: 2 };
					drawRef?.add(polygon);
					continue;
				}

				if (difference) {
					difference.properties = { class_id: 2 };
					intersection.properties = { class_id: 1 };
					drawRef?.add(difference);
					drawRef?.add(intersection);
				}
				else {
					polygon.properties = { class_id: 1 };
					drawRef?.add(polygon);
				}
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
		const statesCount = statePolygons.length;
		const clueCount = statesCount < defaultClueCount + 5 ? Math.max(0, statesCount - 5) : defaultClueCount;
		const randomIndices = randomUniqueIndices(clueCount + 1, statesCount);
		const [ randomStateIndex ] = randomIndices;

		if (clueMode) {
			setCluePolygons(() => []);

			randomIndices.delete(randomStateIndex);

			const randomCluePolygons = statePolygons.filter((_, index) => randomIndices.has(index)).map(([ , polygonData ]) => polygonData);

			setCluePolygons(randomCluePolygons);
		}

		for (let i = 0; i < statePolygons.length; i++) {
			if (i === randomStateIndex) {
				const [ polygonName, polygonData ] = statePolygons[ i ];

				setTargetPolygon(polygonData);
				setTargetState(polygonName);
				statePolygons.splice(i, 1);

				break;
			}
		}
	};

	const restartGame = () => {
		setPastPolygons(() => []);
		setCluePolygons(() => []);

		statePolygons = initializePolygons(SINGLE_POLYGON_STATES, MULTI_POLYGON_STATES);

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
		setUserPolygon(undefined);
		setTargetPolygon(undefined);

		drawRef?.deleteAll();

		setFinalScore(-1);
		setPolygons({});
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
		}

		if (clueMode) {
			displayPastPolygons();
		}
	}, [ targetCount ]);

	React.useEffect(() => {
		if (clueMode) {
			displayCluePolygons();
		}
	}, [ cluePolygons ]);

	React.useEffect(() => {
		if (showResults) {
			drawRef?.deleteAll();
			displayPastPolygons();
		}
	}, [ showResults ]);

	return (
		<div className='polygon-game'>
			<DrawingTools
				onCreate={ onDrawUpdate }
				onDelete={ onDrawDelete }
				onUpdate={ onDrawUpdate } />

			{ renderMenu() }

			<div className='buttons'>
				{
					!isDrawing && !userPolygon && <button className='start' onClick={ onDrawStart }>Draw</button>
				}

				{
					finalScore >= 0 && !isDrawing && !didGameEnd &&
					<button className='next' onClick={ incrementTargetCount }>Next</button>
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
