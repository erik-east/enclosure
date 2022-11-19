import { combineReducers } from '@reduxjs/toolkit';

import applicationReducer from './application/slice';
import authReducer from './auth/slice';
import scoresReducer from './scores/slice';

const reducers = combineReducers({
	application: applicationReducer,
	auth: authReducer,
	scores: scoresReducer
});

export default reducers;
