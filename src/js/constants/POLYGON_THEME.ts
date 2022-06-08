export const POLYGON_THEME = [
	{
		filter: [ 'all', [ '==', 'active', 'false' ], [ '==', '$type', 'Polygon' ], [ '!=', 'mode', 'static' ] ],
		id: 'gl-draw-polygon-fill-inactive',
		paint: {
			'fill-color': [
				'case',
				[ '==', [ 'get', 'user_class_id' ], 1 ], '#0BDE00',
				[ '==', [ 'get', 'user_class_id' ], 2 ], '#FF0000',
				[ '==', [ 'get', 'user_class_id' ], 3 ], '#AB7343',
				'#3bb2d0'
			],
			'fill-opacity': [
				'case',
				[ '==', [ 'get', 'user_class_id' ], 1 ], 0.75,
				[ '==', [ 'get', 'user_class_id' ], 2 ], 0.75,
				[ '==', [ 'get', 'user_class_id' ], 3 ], 0.7,
				0.1
			],
			'fill-outline-color': '#3bb2d0'
		},
		type: 'fill'
	},
	{
		filter: [ 'all', [ '==', 'active', 'true' ], [ '==', '$type', 'Polygon' ] ],
		id: 'gl-draw-polygon-fill-active',
		paint: {
			'fill-color': '#fbb03b',
			'fill-opacity': 0.1,
			'fill-outline-color': '#fbb03b'
		},
		type: 'fill'
	},
	{
		filter: [ 'all', [ '==', '$type', 'Point' ], [ '==', 'meta', 'midpoint' ] ],
		id: 'gl-draw-polygon-midpoint',
		paint: {
			'circle-color': '#fbb03b',
			'circle-radius': 3
		},
		type: 'circle'
	},
	{
		filter: [ 'all',
			[ '==', 'active', 'false' ],
			[ '==', '$type', 'Polygon' ],
			[ '!=', 'mode', 'static' ]
		],
		id: 'gl-draw-polygon-stroke-inactive',
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': [
				'case',
				[ '==', [ 'get', 'user_class_id' ], 1 ], '#045D00',
				[ '==', [ 'get', 'user_class_id' ], 2 ], '#B60000',
				[ '==', [ 'get', 'user_class_id' ], 3 ], '#AB7343',
				'#3bb2d0'
			],
			'line-width': [
				'case',
				[ '==', [ 'get', 'user_class_id' ], 1 ], 1,
				[ '==', [ 'get', 'user_class_id' ], 2 ], 2,
				[ '==', [ 'get', 'user_class_id' ], 3 ], 1,
				2
			]
		},
		type: 'line'
	},
	{
		filter: [ 'all', [ '==', 'active', 'true' ], [ '==', '$type', 'Polygon' ] ],
		id: 'gl-draw-polygon-stroke-active',
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#fbb03b',
			'line-dasharray': [ 0.2, 2 ],
			'line-width': 2
		},
		type: 'line'
	},
	{
		filter: [ 'all',
			[ '==', 'active', 'false' ],
			[ '==', '$type', 'LineString' ],
			[ '!=', 'mode', 'static' ]
		],
		id: 'gl-draw-line-inactive',
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#3bb2d0',
			'line-width': 2
		},
		type: 'line'
	},
	{
		filter: [ 'all',
			[ '==', '$type', 'LineString' ],
			[ '==', 'active', 'true' ]
		],
		id: 'gl-draw-line-active',
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#fbb03b',
			'line-dasharray': [ 0.2, 2 ],
			'line-width': 2
		},
		type: 'line'
	},
	{
		filter: [ 'all',
			[ '==', 'meta', 'vertex' ],
			[ '==', '$type', 'Point' ],
			[ '!=', 'mode', 'static' ]
		],
		id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
		paint: {
			'circle-color': '#fff',
			'circle-radius': 5
		},
		type: 'circle'
	},
	{
		filter: [ 'all',
			[ '==', 'meta', 'vertex' ],
			[ '==', '$type', 'Point' ],
			[ '!=', 'mode', 'static' ]
		],
		id: 'gl-draw-polygon-and-line-vertex-inactive',
		paint: {
			'circle-color': '#fbb03b',
			'circle-radius': 3
		},
		type: 'circle'
	},
	{
		filter: [ 'all',
			[ '==', 'active', 'false' ],
			[ '==', '$type', 'Point' ],
			[ '==', 'meta', 'feature' ],
			[ '!=', 'mode', 'static' ]
		],
		id: 'gl-draw-point-point-stroke-inactive',
		paint: {
			'circle-color': '#fff',
			'circle-opacity': 1,
			'circle-radius': 5
		},
		type: 'circle'
	},
	{
		filter: [ 'all',
			[ '==', 'active', 'false' ],
			[ '==', '$type', 'Point' ],
			[ '==', 'meta', 'feature' ],
			[ '!=', 'mode', 'static' ]
		],
		id: 'gl-draw-point-inactive',
		paint: {
			'circle-color': '#3bb2d0',
			'circle-radius': 3
		},
		type: 'circle'
	},
	{
		filter: [ 'all',
			[ '==', '$type', 'Point' ],
			[ '==', 'active', 'true' ],
			[ '!=', 'meta', 'midpoint' ]
		],
		id: 'gl-draw-point-stroke-active',
		paint: {
			'circle-color': '#fff',
			'circle-radius': 7
		},
		type: 'circle'
	},
	{
		filter: [ 'all',
			[ '==', '$type', 'Point' ],
			[ '!=', 'meta', 'midpoint' ],
			[ '==', 'active', 'true' ] ],
		id: 'gl-draw-point-active',
		paint: {
			'circle-color': '#fbb03b',
			'circle-radius': 5
		},
		type: 'circle'
	},
	{
		filter: [ 'all', [ '==', 'mode', 'static' ], [ '==', '$type', 'Polygon' ] ],
		id: 'gl-draw-polygon-fill-static',
		paint: {
			'fill-color': '#404040',
			'fill-opacity': 0.1,
			'fill-outline-color': '#404040'
		},
		type: 'fill'
	},
	{
		filter: [ 'all', [ '==', 'mode', 'static' ], [ '==', '$type', 'Polygon' ] ],
		id: 'gl-draw-polygon-stroke-static',
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#404040',
			'line-width': 2
		},
		type: 'line'
	},
	{
		filter: [ 'all', [ '==', 'mode', 'static' ], [ '==', '$type', 'LineString' ] ],
		id: 'gl-draw-line-static',
		layout: {
			'line-cap': 'round',
			'line-join': 'round'
		},
		paint: {
			'line-color': '#404040',
			'line-width': 2
		},
		type: 'line'
	},
	{
		filter: [ 'all', [ '==', 'mode', 'static' ], [ '==', '$type', 'Point' ] ],
		id: 'gl-draw-point-static',
		paint: {
			'circle-color': '#404040',
			'circle-radius': 5
		},
		type: 'circle'
	}
];
