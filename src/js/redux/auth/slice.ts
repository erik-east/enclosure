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
		failedReceiveRemoveServerSideCookie: (state: IAuthState) => {
			state.requestingRemoveServerSideCookie = false;
		},
		failedReceiveSetServerSideCookie: (state: IAuthState) => {
			state.requestingSetServerSideCookie = false;
		},
		receiveRemoveServerSideCookie: (state: IAuthState) => {
			state.requestingRemoveServerSideCookie = false;
		},
		receiveSetServerSideCookie: (state: IAuthState) => {
			state.requestingSetServerSideCookie = false;
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
	failedReceiveRemoveServerSideCookie,
	failedReceiveSetServerSideCookie,
	receiveRemoveServerSideCookie,
	receiveSetServerSideCookie,
	requestRemoveServerSideCookie,
	requestSetServerSideCookie,
	resetAuth
} = authSlice.actions;

export default authSlice.reducer;
