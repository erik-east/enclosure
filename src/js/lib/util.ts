import * as turf from '@turf/turf';

export function debounce<T extends (...params: Array<any>) => void>(context: T, time: number): (...params: Array<any>) => void {
	let timeout: number;

	return function(...args: Array<any>) {
		clearTimeout(timeout);

		timeout = window.setTimeout(context.bind(this, ...args), time);
	};
}

// Return the number of clues to display for each game type/content
export function determineClueCount(content: string, gameId: string): number {
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
}

// Return the total target count depending on the content, difficulty and game mode
export function determineTotalTargetCount(content: string, gameId: string, gameMode: string): number {
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
}

// Returns area of a polygon in square miles
export function getPolygonArea(polygon: turf.helpers.Polygon | turf.helpers.MultiPolygon): number {
	return turf.convertArea(turf.area(polygon), 'meters', 'miles');
}

export function initializePolygons(singlePolygons: unknown, multiPolygons: unknown): Array<any> {
	const polygons = [];

	Object.entries(singlePolygons).map(([ name, geometry ]) => {
		const polygonData = turf.polygon(geometry);
		const polygonName = name.toLowerCase().replace(/_/g, ' ');

		polygons.push([ polygonName, polygonData ]);
	});

	Object.entries(multiPolygons).map(([ name, geometry ]) => {
		const polygonData = turf.multiPolygon(geometry);
		const polygonName = name.toLowerCase().replace(/_/g, ' ');

		polygons.push([ polygonName, polygonData ]);
	});

	return polygons;
}

export function randomUniqueIndices(qty: number, count: number): Set<number> {
	const set = new Set<number>();

	while (set.size < qty) {
		set.add(Math.floor(Math.random() * count));
	}

	return set;
}
