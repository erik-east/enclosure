import * as turf from '@turf/turf';

export function debounce<T extends (...params: Array<any>) => void>(context: T, time: number): (...params: Array<any>) => void {
	let timeout: number;

	return function(...args: Array<any>) {
		clearTimeout(timeout);

		timeout = window.setTimeout(context.bind(this, ...args), time);
	};
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
