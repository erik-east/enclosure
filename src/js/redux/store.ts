import { configureStore } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import createSageMiddleware from 'redux-saga';

import reducers from './reducers';
import sagas from './sagas';

const loggerMiddleware = createLogger({ collapsed: true });
const sagaMiddleware = createSageMiddleware();
const development = true; // TODO: Revisit this after separating development and production

const store = configureStore({
	middleware: (getDefaultMiddleware) => {
		return development ? getDefaultMiddleware({
			thunk: false
		}).prepend(
			loggerMiddleware,
			sagaMiddleware
		) : getDefaultMiddleware({ thunk: false }).prepend(sagaMiddleware);
	},
	reducer: reducers
});

sagaMiddleware.run(sagas);

export type IEnclosureState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
