import * as React from 'react';
import { NavLink } from 'react-router-dom';

const PolygonGameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game-selection'>
			<div className='games'>
				<span>Polygon Games</span>
				<NavLink to='5'>US States (5)</NavLink>
				<NavLink to='10'>US States (10)</NavLink>
				<NavLink to='20'>US States (20)</NavLink>
			</div>
		</div>
	);
};

export default PolygonGameSelection;
