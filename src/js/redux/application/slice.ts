import { createSlice } from '@reduxjs/toolkit';

import { IApplicationState } from '../../types';

import applicationState from './state';

const applicationSlice = createSlice({
	initialState: applicationState,
	name: 'application',
	reducers: {
		resetApplication: () => applicationState,
		setMobile: (state: IApplicationState) => {
			state.mobile = true;
		}
	}
});

export const { resetApplication, setMobile } = applicationSlice.actions;

export default applicationSlice.reducer;
