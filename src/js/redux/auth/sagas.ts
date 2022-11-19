import { PayloadAction } from '@reduxjs/toolkit';
import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';

import { IAuthActionPayload } from '../../types/IAuth';

import { postLogin } from './data';
import { failedReceiveSetServerSideCookie, receiveSetServerSideCookie } from './slice';

export function* requestSetServerSideCookie(action: PayloadAction<IAuthActionPayload>): any {
	try {
		const { password, username } = action.payload;

		if (username && password) {
			const response = yield call(postLogin, username, password);

			if (!response || response.status !== 200) {
				yield put(failedReceiveSetServerSideCookie());
			}
			else {
				yield put(receiveSetServerSideCookie());
			}
		}
		else {
			throw new Error('Missing username or password.');
		}
	}
	catch (e) {
		yield put(failedReceiveSetServerSideCookie());
	}
}

export function* watchRequestSetServerSideCookie(): any {
	yield takeLatest('auth/requestSetServerSideCookie', requestSetServerSideCookie);
}
