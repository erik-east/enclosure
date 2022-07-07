import * as React from 'react';
import { NavLink } from 'react-router-dom';

const ClueModeGameSelection: React.FC = (): JSX.Element => {
	return (
		// TODO: Update className with clue-mode after adding it as a class
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Clue Mode</div>
				<NavLink to='us-states/easy'>US States - Easy</NavLink>
				<NavLink to='us-states/medium'>US States - Medium</NavLink>
				<NavLink to='us-states/hard'>US States - Hard</NavLink>

				<NavLink to='european-countries/easy'>European Countries - Easy</NavLink>
				<NavLink to='european-countries/medium'>European Countries - Medium</NavLink>
				<NavLink to='european-countries/hard'>European Countries - Hard</NavLink>
			</div>
		</div>
	);
};

export default ClueModeGameSelection;
