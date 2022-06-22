import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
	const navigate = useNavigate();

	return (
		<nav className='navbar'>
			<div className='logo' onClick={ () => navigate('/game') }>Enclosure</div>

			<div className='links'>
				<NavLink to='/game' className=''>Game</NavLink>
				<NavLink to='/leaderboards' className=''>Leaderboards</NavLink>
			</div>
		</nav>
	);
};

export default Navbar;
