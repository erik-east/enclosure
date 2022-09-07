/* eslint-disable no-console */
import * as turf from '@turf/turf';
import * as React from 'react';
import { LngLatLike, Popup, useMap } from 'react-map-gl';
import { useNavigate, useParams } from 'react-router-dom';

import { DEFAULT_GAME_CONFIGURATIONS } from '../constants/DEFAULT_GAME_CONFIGURATIONS';
import { INITIAL_POSITION } from '../constants/INITIAL_POSITION';
import { MULTI_POLYGON_EUROPEAN_COUNTRIES } from '../constants/MULTI_POLYGON_EUROPEAN_COUNTRIES';
import { MULTI_POLYGON_SOUTH_AMERICAN_COUNTRIES } from '../constants/MULTI_POLYGON_SOUTH_AMERICAN_COUNTRIES';
import { MULTI_POLYGON_STATES } from '../constants/MULTI_POLYGON_STATES';
import { SINGLE_POLYGON_SOUTH_AMERICAN_COUNTRIES } from '../constants/SINGLE_POLYGON_SOUTH_AMERICAN_COUNTRIES';
import { SINGLE_POLYGON_STATES } from '../constants/SINGLE_POLYGON_STATES';
import { initializePolygons, randomUniqueIndices } from '../lib/util';

import DrawingTools, { drawRef }  from './DrawingTools';

import 'mapbox-gl/dist/mapbox-gl.css';

const { MAXIMUM_SCORE, MEMORY_MODE_DISPLAY_TIME } = DEFAULT_GAME_CONFIGURATIONS;

const memoryPolygonTimeouts = [];
let gameContentPolygons = [];
let tooltipTimeout;

// TODO: Move to lib
const determineClueCount = (content: string, gameId: string) => {
	if (content === 'europe') {
		switch (gameId) {
			case 'easy':
				return 7;
			case 'medium':
				return 4;
			case 'hard':
				return 2;
			default:
				return 4;
		}
	}

	if (content === 'south-america') {
		switch (gameId) {
			case 'easy':
				return 3;
			case 'medium':
				return 2;
			case 'hard':
				return 1;
			default:
				return 2;
		}
	}

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

const determineGameContentPolygons = (content: string) => {
	let gameContentPolygons = [];

	if (content === 'us-states') {
		gameContentPolygons = initializePolygons(SINGLE_POLYGON_STATES, MULTI_POLYGON_STATES);
	}
	else if (content === 'europe') {
		gameContentPolygons = initializePolygons([], MULTI_POLYGON_EUROPEAN_COUNTRIES);
	}
	else if (content === 'south-america') {
		gameContentPolygons = initializePolygons(SINGLE_POLYGON_SOUTH_AMERICAN_COUNTRIES, MULTI_POLYGON_SOUTH_AMERICAN_COUNTRIES);
	}

	return gameContentPolygons;
};

const determineTotalTargetCount = (content: string, gameId: string, gameMode: string) => {
	if (gameMode === 'classic' || gameMode === 'memorize') {
		return turf.isNumber(Number(gameId)) ? Number(gameId) : 0;
	}

	if ((gameMode === 'clue' && (gameId === 'easy' || gameId === 'medium' || gameId === 'hard'))) {
		if (content === 'us-states') {
			return 50;
		}

		if (content === 'europe') {
			return 38;
		}

		if (content === 'south-america') {
			return 13;
		}
	}

	return 0;
};

const PolygonGame: React.FC<{ clueMode?: boolean; memorizeMode?: boolean }> = ({ clueMode = false, memorizeMode = false }): JSX.Element => {
	const [ finalScore, setFinalScore ] = React.useState(-1);
	const [ totalFinalScore, setTotalFinalScore ] = React.useState(0);
	const [ didGameEnd, setDidGameEnd ] = React.useState(false);
	const [ showResults, setShowResults ] = React.useState(false);
	const [ isDrawing, setIsDrawing ] = React.useState(false);
	const [ polygons, setPolygons ] = React.useState({});
	const [ targetCount, setTargetCount ] = React.useState(1);
	const [ targetName, setTargetName ] = React.useState('');
	const [ targetPolygon, setTargetPolygon ] = React.useState();
	const [ userPolygon, setUserPolygon ] = React.useState();
	const [ cluePolygons, setCluePolygons ] = React.useState([]);
	const [ pastPolygons, setPastPolygons ] = React.useState([]);
	const [ memoryPolygons, setMemoryPolygons ] = React.useState([]);
	const [ isDisplayingMemoryPolygons, setIsDisplayingMemoryPolygons ] = React.useState(false); // Add state machine to keep track of status instead
	const [ didMemoryPolygonsDisplay, setDidMemoryPolygonsDisplay ] = React.useState(false);
	const [ showTooltip, setShowTooltip ] = React.useState(false);
	const [ polygonTooltip, setPolygonTooltip ] = React.useState({
		coordinates: [],
		tooltipText: ''
	});
	const { mapbox } = useMap();
	const navigate = useNavigate();
	const { content, id: gameId } = useParams();
	// eslint-disable-next-line no-nested-ternary
	const gameMode = clueMode ? 'clue' : (memorizeMode ? 'memorize' : 'classic');
	const totalTargetCount = determineTotalTargetCount(content, gameId, gameMode);
	const defaultClueCount = determineClueCount(content, gameId);
	// Need this to be able to use the target count inside setTimeout
	const targetCountRef = React.useRef(targetCount);

	targetCountRef.current = targetCount;

	const incrementTargetCount = () => setTargetCount(targetCountRef.current + 1);
	const incrementTotalFinalScore = (finalScore) => setTotalFinalScore(totalFinalScore + Number(finalScore));

	const addPastPolygon = (pastPolygon: any) => {
		setPastPolygons((array) => [ ...array, pastPolygon ]);
	};

	const determineResults = () => {
		const intersection: any = userPolygon && turf.intersect(userPolygon, targetPolygon);
		const pastPolygon: { difference: any; intersection: any; name: string; polygon: any } = { difference: null, intersection, name: targetName, polygon: targetPolygon };

		flyToTargetDestination(targetPolygon);

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
			const penaltyMultiplier = drawnArea > (targetArea * 1.25) ? drawAccuracy * 0.85 : drawAccuracy;
			const finalScore = MAXIMUM_SCORE * baseMultiplier * penaltyMultiplier;

			setFinalScore(Number(finalScore.toFixed(0)));
			incrementTotalFinalScore(Number(finalScore.toFixed(0)));

			// TODO: Add these to the score sheet
			console.log('base multiplier:', baseMultiplier.toFixed(2));
			console.log('penalty multiplier:', penaltyMultiplier.toFixed(2));

			const difference = turf.difference(targetPolygon, intersection);

			if (difference) {
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
				const { data: polygonData, name: polygonName } = cluePolygons[ i ];

				polygonData.properties = { class_id: 'clue', polygon_name: polygonName };
				drawRef?.add(polygonData);
			}
		}
	};

	const displayPastPolygons = () => {
		if (pastPolygons && Object.keys(pastPolygons).length > 0) {
			const pastPolygonsLength = Object.keys(pastPolygons).length;

			for (let i = 0; i < pastPolygonsLength; i++) {
				const { difference, intersection, name, polygon } = pastPolygons[ i ];

				if (intersection === null) {
					polygon.properties = { class_id: 2, polygon_name: name };
					drawRef?.add(polygon);
					continue;
				}

				if (difference) {
					difference.properties = { class_id: 2, polygon_name: name };
					intersection.properties = { class_id: 1, polygon_name: name };
					drawRef?.add(difference);
					drawRef?.add(intersection);
				}
				else {
					polygon.properties = { class_id: 1, polygon_name: name };
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

	const addPolygonMouseEvents = () => {
		mapbox.on('mouseenter', 'gl-draw-polygon-fill-inactive.cold', (e) => {
			onPolygonMouseEnter(e);
		});

		mapbox.on('mouseleave', 'gl-draw-polygon-fill-inactive.cold', () => {
			onPolygonMouseLeave();
		});

		// Disables interaction by resetting the mode when a feature is selected
		mapbox.on('draw.selectionchange', () => {
			setTimeout(() => drawRef?.changeMode('simple_select'), 150);
		});
	};

	const onPolygonMouseEnter = (e) => {
		const features = mapbox.queryRenderedFeatures(e.point);
		const { geometry, properties } = features[ 0 ];
		const { coordinates } = turf.centroid(geometry as turf.AllGeoJSON).geometry;
		const { user_polygon_name: polygonName } = properties;

		if (tooltipTimeout !== undefined) {
			clearTimeout(tooltipTimeout);
			tooltipTimeout = undefined;
		}

		setPolygonTooltip({ coordinates, tooltipText: polygonName || '' });
		setShowTooltip(true);
	};

	const onPolygonMouseLeave = () => {
		tooltipTimeout = setTimeout(() => {
			setShowTooltip(false);
			setPolygonTooltip({ coordinates: [], tooltipText: '' });
		}, 100);
	};

	const onDisplayMemoryPolygons = () => {
		if (memoryPolygons && Object.keys(memoryPolygons).length > 0) {
			const memoryPolygonsLength = Object.keys(memoryPolygons).length;

			setIsDisplayingMemoryPolygons(true);

			for (let i = 0; i < memoryPolygonsLength; i++) {
				const { data: polygonData, name: polygonName } = memoryPolygons[ i ];

				memoryPolygonTimeouts.push(setTimeout(() => {
					drawRef?.deleteAll();

					polygonData.properties = { class_id: 1, polygon_name: polygonName };
					drawRef?.add(polygonData);

					flyToTargetDestination(polygonData);

					setTargetName(polygonName);

					if (i > 0) {
						incrementTargetCount();
					}

					if (i + 1 === Number(gameId)) {
						setTimeout(() => {
							const { data: polygonData, name: polygonName } = memoryPolygons[ 0 ];

							drawRef?.deleteAll();
							flyToInitialPosition();

							setTargetCount(1);
							setTargetName(polygonName);
							setTargetPolygon(polygonData);

							setDidMemoryPolygonsDisplay(true);
							setIsDisplayingMemoryPolygons(false);
						}, MEMORY_MODE_DISPLAY_TIME);
					}
				}, i * MEMORY_MODE_DISPLAY_TIME));
			}
		}
	};

	const prepareNewTarget = () => {
		const gameContentPolygonsCount = gameContentPolygons.length;
		const clueCount = gameContentPolygonsCount < defaultClueCount + 5 ? Math.max(0, gameContentPolygonsCount - 5) : defaultClueCount;
		const randomIndices = randomUniqueIndices(clueCount + 1, gameContentPolygonsCount);
		const [ randomTargetPolygonIndex ] = randomIndices;

		if (clueMode) {
			setCluePolygons(() => []);

			randomIndices.delete(randomTargetPolygonIndex);

			const randomCluePolygons = gameContentPolygons.filter((_, index) => randomIndices.has(index)).map(([ polygonName, polygonData ]) => {
				return { data: polygonData, name: polygonName };
			});

			setCluePolygons(randomCluePolygons);
		}

		for (let i = 0; i < gameContentPolygons.length; i++) {
			if (i === randomTargetPolygonIndex) {
				const [ polygonName, polygonData ] = gameContentPolygons[ i ];

				setTargetPolygon(polygonData);
				setTargetName(polygonName);
				gameContentPolygons.splice(i, 1);

				break;
			}
		}
	};

	const setUpMemorizeModeTargets = () => {
		const gameContentPolygonsCount = gameContentPolygons.length;
		const randomIndices = randomUniqueIndices(Number(gameId), gameContentPolygonsCount);

		const randomMemoryPolygons = gameContentPolygons.filter((_, index) => randomIndices.has(index)).map(([ polygonName, polygonData ]) => {
			return { data: polygonData, name: polygonName };
		});

		setMemoryPolygons(randomMemoryPolygons);
	};

	const restartGame = () => {
		if (memorizeMode) {
			setDidMemoryPolygonsDisplay(false);
		}

		setPastPolygons(() => []);
		setCluePolygons(() => []);

		gameContentPolygons = determineGameContentPolygons(content);

		flyToInitialPosition();

		resetTarget();
		setTotalFinalScore(0);
		setDidGameEnd(false);
		setShowResults(false);
		setIsDrawing(false);
		setTargetCount(1);
		setTargetName('');
		setTargetPolygon(undefined);

		if (memorizeMode) {
			setUpMemorizeModeTargets();
		}
		else {
			prepareNewTarget();
		}
	};

	const resetTarget = () => {
		setUserPolygon(undefined);
		setTargetPolygon(undefined);

		drawRef?.deleteAll();

		flyToInitialPosition();

		setFinalScore(-1);
		setPolygons({});
	};

	const flyToInitialPosition = () => {
		const { latitude, longitude, zoom } = INITIAL_POSITION[ content ];
		const center: LngLatLike = [ longitude, latitude ];

		mapbox.flyTo({
			center,
			zoom
		});
	};

	const flyToTargetDestination = (targetDestination: any) => {
		const area = turf.area(targetDestination);
		const center = turf.centroid(targetDestination);
		const { coordinates } = center.geometry;
		const areaMillionth = area / 1000000000;
		let zoomLevel = 5;

		if (areaMillionth > 1500) {
			zoomLevel = 3.45;
		}
		else if (areaMillionth > 1000) {
			zoomLevel = 3.75;
		}
		else if (areaMillionth > 500) {
			zoomLevel = 4;
		}
		else if (areaMillionth > 300) {
			zoomLevel = 4.25;
		}
		else if (areaMillionth < 5) {
			zoomLevel = 8.5;
		}
		else if (areaMillionth < 10) {
			zoomLevel = 7.5;
		}
		else if (areaMillionth < 25) {
			zoomLevel = 6.5;
		}
		else if (areaMillionth < 50) {
			zoomLevel = 6.25;
		}

		mapbox.flyTo({
			center: coordinates as LngLatLike,
			zoom: zoomLevel
		});
	};

	const renderButtons = (): JSX.Element => {
		if (isDrawing || isDisplayingMemoryPolygons) {
			return null;
		}

		return (
			<div className='buttons'>
				{ renderDisplayMemoryPolygonsButton() }
				{ renderDrawStartButton() }
				{ renderNextTargetButton() }
				{ renderShowResultsButton() }
				{ renderRestartGameButton() }
			</div>
		);
	};

	const renderDrawStartButton = (): JSX.Element => {
		if ((memorizeMode && !didMemoryPolygonsDisplay) || isDrawing || userPolygon) {
			return null;
		}

		return  <button className='start' onClick={ onDrawStart }>Draw</button>;
	};

	const renderDisplayMemoryPolygonsButton = (): JSX.Element => {
		if (memorizeMode && !didMemoryPolygonsDisplay && !isDisplayingMemoryPolygons) {
			return <button className='start' onClick={ onDisplayMemoryPolygons }>Start</button>;
		}

		return null;
	};

	const renderNextTargetButton = (): JSX.Element => {
		if (!didGameEnd && !isDrawing && finalScore >= 0) {
			return <button className='next' onClick={ incrementTargetCount }>Next</button>;
		}

		return null;
	};

	const renderRestartGameButton = (): JSX.Element => {
		if (showResults) {
			return <button className='restart' onClick={ () => restartGame() }>Restart</button>;
		}

		return null;
	};

	const renderShowResultsButton = (): JSX.Element => {
		if (didGameEnd && !showResults) {
			return <button className='show-results' onClick={ () => setShowResults(true) }>Results</button>;
		}

		return null;
	};

	const renderInteractiveMenu = (): JSX.Element => {
		if (showResults) {
			return (
				<div className='interactive-menu'>
					<div className='title'>Play Again?</div>
					{ renderButtons() }
				</div>
			);
		}

		if (memorizeMode && !didMemoryPolygonsDisplay && !isDisplayingMemoryPolygons) {
			return (
				<div className='interactive-menu'>
					<div className='current-target'>
						<span>Ready?</span>
					</div>

					{ renderButtons() }
				</div>
			);
		}

		return (
			<div className='interactive-menu'>
				<div className='current-target'>
					<span>{ targetName }</span>
					<span className='count'>{ targetCount } / { totalTargetCount }</span>
				</div>

				{ renderButtons() }
			</div>
		);
	};

	const renderScoreMenu = (): JSX.Element => {
		if (showResults) {
			return (
				<div className='score-menu'>
					<div className='title'>Final Score</div>
					<div className='score'>{ totalFinalScore } / { MAXIMUM_SCORE * Number(totalTargetCount) } </div>
				</div>
			);
		}

		if (finalScore >= 0) {
			return (
				<div className='score-menu'>
					<div className='title'>Score ({ targetName })</div>
					<div className='score'>{ finalScore } / { MAXIMUM_SCORE }</div>
				</div>
			);
		}

		return null;
	};

	const renderPolygonTooltip = () => {
		if (showTooltip && polygonTooltip) {
			const { coordinates, tooltipText } = polygonTooltip;

			if (tooltipText === '') {
				return null;
			}

			return (
				<Popup
					anchor='bottom'
					closeButton={ false }
					closeOnClick={ false }
					closeOnMove
					focusAfterOpen={ false }
					longitude={ coordinates[ 0 ] }
					latitude={ coordinates[ 1 ] }
					offset={ [ 0, -30 ] }>
					<div className='polygon-tooltip'>
						{ tooltipText }
					</div>
				</Popup>
			);
		}

		return null;
	};

	React.useEffect(() => {
		if (!content || (content !== 'us-states' && content !== 'europe' && content !== 'south-america')) {
			navigate('/');

			return;
		}

		if ((!totalTargetCount || Number(totalTargetCount) < 1
		|| (content === 'us-states' && Number(totalTargetCount) > 50)
		|| (content === 'europe' && Number(totalTargetCount) > 38)
		|| (content === 'south-america' && Number(totalTargetCount) > 13))) {
			navigate(`/${gameMode}`, { replace: true });

			return;
		}

		flyToInitialPosition();

		gameContentPolygons = determineGameContentPolygons(content);

		// Mapbox Polygon Related Event Listeners
		addPolygonMouseEvents();

		if (memorizeMode) {
			setUpMemorizeModeTargets();
		}
		else {
			// Sets up the first target
			prepareNewTarget();
		}

		return () => {
			memoryPolygonTimeouts.forEach((timeout) => clearTimeout(timeout));
		};
	}, [ ]);

	React.useEffect(() => {
		// TODO: Change this when user can add multiple polygons
		if (userPolygon && targetCount === Number(totalTargetCount)) {
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
		if (memorizeMode && !didMemoryPolygonsDisplay) {
			return;
		}

		if (targetCount > 1) {
			resetTarget();

			if (memorizeMode) {
				const memoryPolygonIndex = targetCount - 1;
				const { data: polygonData, name: polygonName } = memoryPolygons[ memoryPolygonIndex ];

				setTargetName(polygonName);
				setTargetPolygon(polygonData);
			}
			else {
				prepareNewTarget();
			}
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
			flyToInitialPosition();
			displayPastPolygons();
		}
	}, [ showResults ]);

	return (
		<div className='polygon-game'>
			<DrawingTools
				onCreate={ onDrawUpdate }
				onDelete={ onDrawDelete }
				onUpdate={ onDrawUpdate } />

			{ renderInteractiveMenu() }
			{ renderScoreMenu() }
			{ renderPolygonTooltip() }
		</div>
	);
};

export default PolygonGame;
