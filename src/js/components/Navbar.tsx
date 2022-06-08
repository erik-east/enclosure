import * as React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => (
	<nav className='navbar'>
		<div className='logo'>Enclosure</div>

		<div className='links'>
			<NavLink to='/game' className=''>Game</NavLink>
			<NavLink to='/leaderboards' className=''>Leaderboards</NavLink>
		</div>
	</nav>
);

export default Navbar;
