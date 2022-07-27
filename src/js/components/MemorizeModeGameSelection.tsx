import * as React from 'react';
import { NavLink } from 'react-router-dom';

const MemorizeModeGameSelection: React.FC = (): JSX.Element => {
	return (
		<div className='polygon-game'>
			<div className='selection'>
				<div className='title'>Memorize Mode</div>

				<div className='us-states'>
					<span>US States</span>
					<NavLink to='us-states/3'>3</NavLink>
					<NavLink to='us-states/6'>6</NavLink>
					<NavLink to='us-states/9'>9</NavLink>
				</div>

				<div className='europe'>
					<span>Europe</span>
					<NavLink to='europe/3'>3</NavLink>
					<NavLink to='europe/6'>6</NavLink>
					<NavLink to='europe/9'>9</NavLink>
				</div>

				<div className='south-america'>
					<span>South America</span>
					<NavLink to='south-america/3'>3</NavLink>
					<NavLink to='south-america/6'>6</NavLink>
					<NavLink to='south-america/9'>9</NavLink>
				</div>
			</div>
		</div>
	);
};

export default MemorizeModeGameSelection;
