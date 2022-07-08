import * as React from 'react';
import { NavLink } from 'react-router-dom';

const ClueModeGameSelection: React.FC = (): JSX.Element => {
	return (
		// TODO: Update className with clue-mode after adding it as a class
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Clue Mode</div>

				<div className='us-states'>
					<span>US States</span>
					<NavLink to='us-states/easy'>Easy</NavLink>
					<NavLink to='us-states/medium'>Medium</NavLink>
					<NavLink to='us-states/hard'>Hard</NavLink>
				</div>

				<div className='european-countries'>
					<span>European Countries</span>
					<NavLink to='european-countries/easy'>Easy</NavLink>
					<NavLink to='european-countries/medium'>Medium</NavLink>
					<NavLink to='european-countries/hard'>Hard</NavLink>
				</div>
			</div>
		</div>
	);
};

export default ClueModeGameSelection;
