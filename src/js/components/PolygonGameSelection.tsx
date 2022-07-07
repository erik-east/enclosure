import * as React from 'react';
import { NavLink } from 'react-router-dom';

const PolygonGameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Polygon Games</div>
				<NavLink to='us-states/5'>US States - 5</NavLink>
				<NavLink to='us-states/10'>US States - 10</NavLink>
				<NavLink to='us-states/25'>US States - 25</NavLink>
				<NavLink to='us-states/50'>US States - 50</NavLink>

				<NavLink to='european-countries/5'>European Countries - 5</NavLink>
				<NavLink to='european-countries/10'>European Countries - 10</NavLink>
				<NavLink to='european-countries/20'>European Countries - 20</NavLink>
				<NavLink to='european-countries/38'>European Countries - 38</NavLink>
			</div>
		</div>
	);
};

export default PolygonGameSelection;
