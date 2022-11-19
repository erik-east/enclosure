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
		failedReceiveSetServerSideCookie: (state: IAuthState) => {
			state.requestingSetServerSideCookie = false;
		},
		receiveSetServerSideCookie: (state: IAuthState) => {
			state.requestingSetServerSideCookie = false;
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
	failedReceiveSetServerSideCookie,
	receiveSetServerSideCookie,
	requestSetServerSideCookie,
	resetAuth
} = authSlice.actions;

export default authSlice.reducer;
