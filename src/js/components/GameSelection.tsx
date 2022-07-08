import * as React from 'react';
import { NavLink } from 'react-router-dom';

const GameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Game Types</div>
				<div className='games'>
					<NavLink to='polygon'>The OG - Polygon</NavLink>
					<NavLink to='clue'>Clue Mode</NavLink>
				</div>
			</div>
		</div>
	);
};

export default GameSelection;
