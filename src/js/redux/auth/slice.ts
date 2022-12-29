import { createSlice } from '@reduxjs/toolkit';

import { IAuthState } from '../../types/IAuth';
import { resetApplication } from '../application/slice';

import authState from './state';

const authSlice = createSlice({
	extraReducers: (builder) => {
		builder.addCase(resetApplication, () => authState);
	},
	initialState: authState,
	name: 'auth',
	reducers: {
		failedReceiveCreateUser: (state: IAuthState) => {
			state.requestingCreateUser = true;
		},
		failedReceiveRemoveServerSideCookie: (state: IAuthState) => {
			state.requestingRemoveServerSideCookie = false;
		},
		failedReceiveSetServerSideCookie: (state: IAuthState) => {
			state.requestingSetServerSideCookie = false;
		},
		receiveCreateUser: (state: IAuthState) => {
			state.requestingCreateUser = false;
		},
		receiveRemoveServerSideCookie: (state: IAuthState) => {
			state.requestingRemoveServerSideCookie = false;
		},
		receiveSetServerSideCookie: (state: IAuthState) => {
			state.requestingSetServerSideCookie = false;
		},
		requestCreateUser: {
			prepare: (username: string, email: string, password: string, firstName: string, lastName: string) => {
				return { payload: { email, firstName, lastName, password, username } };
			},
			reducer: (state: IAuthState) => {
				state.requestingCreateUser = true;
			}
		},
		requestRemoveServerSideCookie: (state: IAuthState) => {
			state.requestingRemoveServerSideCookie = true;
		},
		requestSetServerSideCookie: {
			prepare: (username: string, password: string) => {
				return { payload: { password, username } };
			},
			reducer: (state: IAuthState) => {
				state.requestingSetServerSideCookie = true;
			}
		},
		resetAuth: () => authState
	}
});

export const {
	failedReceiveCreateUser,
	failedReceiveRemoveServerSideCookie,
	failedReceiveSetServerSideCookie,
	receiveCreateUser,
	receiveRemoveServerSideCookie,
	receiveSetServerSideCookie,
	requestCreateUser,
	requestRemoveServerSideCookie,
	requestSetServerSideCookie,
	resetAuth
} = authSlice.actions;

export default authSlice.reducer;
