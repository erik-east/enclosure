import { PayloadAction } from '@reduxjs/toolkit';
import {
	call,
	put,
	takeLatest
} from 'redux-saga/effects';

import { IScoresActionPayload } from '../../types/IScores';

import {
	getHighScores,
	getUserHighScore,
	postUserScore
} from './data';
import {
	failedReceiveHighScores,
	failedReceiveSetUserScore,
	failedReceiveUserHighScore,
	receiveHighScores,
	receiveSetUserScore,
	receiveUserHighScore
} from './slice';

export function* requestHighScores(action: PayloadAction<IScoresActionPayload>): any {
	try {
		const { gameContentSlug, gameModeSlug, gameModifier } = action.payload;

		if (gameModifier && gameModeSlug && gameContentSlug) {
			const response = yield call(getHighScores, gameModifier, gameModeSlug, gameContentSlug);

			if (!response || response.status !== 200) {
				yield put(failedReceiveHighScores());
			}
			else {
				yield put(receiveHighScores(response.data));
			}
		}
		else {
			throw new Error('Missing game type.');
		}
	}
	catch (e) {
		yield put(failedReceiveHighScores());
	}
}

export function* requestSetUserScore(action: PayloadAction<IScoresActionPayload>): any {
	try {
		const { gameContentSlug, gameModeSlug, gameModifier, score } = action.payload;

		if (score && gameModifier && gameModeSlug && gameContentSlug) {
			const response = yield call(postUserScore, score, gameModifier, gameModeSlug, gameContentSlug);

			if (!response || response.status !== 200) {
				yield put(failedReceiveSetUserScore());
			}
			else {
				yield put(receiveSetUserScore(response.data));
			}
		}
		else {
			throw new Error('Missing score or game type.');
		}
	}
	catch (e) {
		yield put(failedReceiveSetUserScore());
	}
}

export function* requestUserHighScore(action: PayloadAction<IScoresActionPayload>): any {
	try {
		const { gameContentSlug, gameModeSlug, gameModifier } = action.payload;

		if (gameModifier && gameModeSlug && gameContentSlug) {
			const response = yield call(getUserHighScore, gameModifier, gameModeSlug, gameContentSlug);

			if (!response || response.status !== 200) {
				yield put(failedReceiveUserHighScore());
			}
			else {
				yield put(receiveUserHighScore(response.data));
			}
		}
		else {
			throw new Error('Missing game type.');
		}
	}
	catch (e) {
		yield put(failedReceiveUserHighScore());
	}
}

export function* watchRequestHighScores(): any {
	yield takeLatest('scores/requestHighScores', requestHighScores);
}

export function* watchRequestSetUserScore(): any {
	yield takeLatest('scores/requestSetUserScore', requestSetUserScore);
}

export function* watchRequestUserHighScore(): any {
	yield takeLatest('scores/requestUserHighScore', requestUserHighScore);
}
