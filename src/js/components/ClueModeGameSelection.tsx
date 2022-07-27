import * as React from 'react';
import { NavLink } from 'react-router-dom';

const ClueModeGameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Clue Mode</div>

				<div className='us-states'>
					<span>US States</span>
					<NavLink to='us-states/easy'>Easy</NavLink>
					<NavLink to='us-states/medium'>Medium</NavLink>
					<NavLink to='us-states/hard'>Hard</NavLink>
				</div>

				<div className='europe'>
					<span>Europe</span>
					<NavLink to='europe/easy'>Easy</NavLink>
					<NavLink to='europe/medium'>Medium</NavLink>
					<NavLink to='europe/hard'>Hard</NavLink>
				</div>

				<div className='south-america'>
					<span>South America</span>
					<NavLink to='south-america/easy'>Easy</NavLink>
					<NavLink to='south-america/medium'>Medium</NavLink>
					<NavLink to='south-america/hard'>Hard</NavLink>
				</div>
			</div>
		</div>
	);
};

export default ClueModeGameSelection;
