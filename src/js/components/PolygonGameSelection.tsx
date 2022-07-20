import * as React from 'react';
import { NavLink } from 'react-router-dom';

const PolygonGameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Polygon Games</div>

				<div className='us-states'>
					<span>US States</span>
					<NavLink to='us-states/5'>5</NavLink>
					<NavLink to='us-states/10'>10</NavLink>
					<NavLink to='us-states/25'>25</NavLink>
					<NavLink to='us-states/50'>50</NavLink>
				</div>

				<div className='europe'>
					<span>Europe</span>
					<NavLink to='europe/5'>5</NavLink>
					<NavLink to='europe/10'>10</NavLink>
					<NavLink to='europe/20'>20</NavLink>
					<NavLink to='europe/38'>38</NavLink>
				</div>

				<div className='south-america'>
					<span>South America</span>
					<NavLink to='south-america/5'>5</NavLink>
					<NavLink to='south-america/10'>10</NavLink>
					<NavLink to='south-america/13'>13</NavLink>
				</div>
			</div>
		</div>
	);
};

export default PolygonGameSelection;
