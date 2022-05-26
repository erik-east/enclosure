/* eslint-disable no-console */
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as React from 'react';
import { MapRef, useControl } from 'react-map-gl';

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

export let drawRef = null;

const DrawControl: React.FC = (props: any): JSX.Element => {
	drawRef = useControl<MapboxDraw>(
		({ map }: { map: MapRef }) => {
			map.on('draw.create', props.onCreate);
			map.on('draw.update', props.onUpdate);
			map.on('draw.delete', props.onDelete);

			return new MapboxDraw(props);
		},
		({ map }: { map: MapRef }) => {
			map.off('draw.create', props.onCreate);
			map.off('draw.update', props.onUpdate);
			map.off('draw.delete', props.onDelete);
		},
		{
			position: props.position
		});

	return null;
};

const DrawingTools: React.FC<{ initialPolygon: any; onCreate: any; onDelete: any; onUpdate: any }> = ({ initialPolygon, onCreate, onDelete, onUpdate }): JSX.Element => {
	React.useEffect(() => {
		console.log(initialPolygon);
		// drawRef?.add(initialPolygon);
	}, [ ]);

	const render = (): JSX.Element => {
		return (
			<DrawControl
				controls={ { polygon: true, trash: true } }
				displayControlsDefault={ false }
				onCreate={ onCreate }
				onDelete={ onDelete }
				onUpdate={ onUpdate } />
		);
	};

	return render();
};

export default DrawingTools;
