import {
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList
} from '@chakra-ui/react';
import { bindActionCreators } from '@reduxjs/toolkit';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';

import { getAuthCookie, isAuthenticated } from '../lib/global';
import { useReduxState } from '../lib/redux';
import { requestRemoveServerSideCookie } from '../redux';
import { IAuthState } from '../types';

const Navbar: React.FC<any> = ({ setSignInModalVisibility }): any => {
	// HOOKS
	const dispatch = useDispatch();
	const navigate = useNavigate();
	// REDUX STATE
	// Having this here makes sure component re-renders when cookie is deleted
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { requestingRemoveServerSideCookie } = useReduxState<IAuthState>('auth');
	// REDUX ACTIONS
	const requestRemoveServerSideCookieDispatch = bindActionCreators(requestRemoveServerSideCookie, dispatch);
	// LOCAL STATE
	const isUserAuthenticated = isAuthenticated();

	const renderMyProfile = () => {
		const profileName = getAuthCookie()?.sub;

		return (
			<Menu>
				<MenuButton as={ Button } className='profile-button'>
					{ profileName }
				</MenuButton>

				<MenuList color='#005066' minW='0' w='85px'>
					<MenuItem onClick={ () => requestRemoveServerSideCookieDispatch() }>Log out</MenuItem>
				</MenuList>
			</Menu>
		);
	};

	return (
		<nav className='navbar'>
			<div className='logo' onClick={ () => navigate('/') }>Enclosure</div>

			<div className='links'>
				<NavLink to='/' className=''>Games</NavLink>
				<NavLink to='/leaderboards' className=''>Leaderboards</NavLink>
				{
					isUserAuthenticated ?  renderMyProfile() : <a className='sign-in' onClick={ () => setSignInModalVisibility(true) }>Sign in</a>
				}
			</div>
		</nav>
	);
};

export default Navbar;
