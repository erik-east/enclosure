import { PayloadAction } from '@reduxjs/toolkit';
import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';

import { IAuthActionPayload } from '../../types/IAuth';

import { postLogin, postLogout } from './data';
import {
	failedReceiveRemoveServerSideCookie,
	failedReceiveSetServerSideCookie,
	receiveRemoveServerSideCookie,
	receiveSetServerSideCookie
} from './slice';

export function* requestRemoveServerSideCookie(): any {
	try {
		const response = yield call(postLogout);

		if (!response || response.status !== 200) {
			yield put(failedReceiveRemoveServerSideCookie());
		}
		else {
			yield put(receiveRemoveServerSideCookie());
		}
	}
	catch (e) {
		yield put(failedReceiveRemoveServerSideCookie());
	}
}

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

export function* watchRequestRemoveServerSideCookie(): any {
	yield takeLatest('auth/requestRemoveServerSideCookie', requestRemoveServerSideCookie);
}

export function* watchRequestSetServerSideCookie(): any {
	yield takeLatest('auth/requestSetServerSideCookie', requestSetServerSideCookie);
}
