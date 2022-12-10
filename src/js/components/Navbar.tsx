import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { getAuthCookie, isAuthenticated } from '../lib/global';

import SignInModal from './SignInModal';

const Navbar: React.FC<any> = ({ signInModalVisibility, setSignInModalVisibility }): any => {
	const navigate = useNavigate();
	const isUserAuthenticated = isAuthenticated();

	return (
		<>
			<nav className='navbar'>
				<div className='logo' onClick={ () => navigate('/') }>Enclosure</div>

				<div className='links'>
					<NavLink to='/' className=''>Games</NavLink>
					<NavLink to='/leaderboards' className=''>Leaderboards</NavLink>
					{
						isUserAuthenticated ?  <a className='user'>{ getAuthCookie().sub }</a> : <a className='sign-in' onClick={ () => setSignInModalVisibility(true) }>Sign in</a>
					}
				</div>
			</nav>

			<SignInModal
				isOpen={ signInModalVisibility }
				onClose={ () => setSignInModalVisibility(false) } />
		</>
	);
};

export default Navbar;
