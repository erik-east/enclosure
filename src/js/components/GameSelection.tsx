import * as React from 'react';
import { NavLink } from 'react-router-dom';

const GameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game-selection'>
			<div className='games'>
				<span>Game Types</span>
				<NavLink to='polygon'>The OG (Polygon)</NavLink>
			</div>
		</div>
	);
};

export default GameSelection;
