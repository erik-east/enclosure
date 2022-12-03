import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
	IHighScore,
	IScoresActionPayload,
	IScoresState
} from '../../types/IScores';
import { resetApplication } from '../application/slice';

import scoresState from './state';

const scoresSlice = createSlice({
	extraReducers: (builder) => {
		builder.addCase(resetApplication, () => scoresState);
	},
	initialState: scoresState,
	name: 'scores',
	reducers: {
		failedReceiveHighScores: (state: IScoresState) => {
			state.requestingHighScores = false;
		},
		failedReceiveSetUserScore: (state: IScoresState) => {
			state.requestingSetUserScore = false;
		},
		failedReceiveUserHighScore: (state: IScoresState) => {
			state.requestingUserHighScore = false;
		},
		receiveHighScores: {
			prepare: (highScores: Array<IHighScore>) => {
				return { payload: { highScores } };
			},
			reducer: (state: IScoresState, action: PayloadAction<IScoresActionPayload>) => {
				const { highScores } = action.payload;

				state.requestingHighScores = false;
				state.highScores = highScores;
			}
		},
		receiveSetUserScore: {
			prepare: (userHighScore: any) => {
				return { payload: { userHighScore } };
			},
			reducer: (state: IScoresState, action: PayloadAction<IScoresActionPayload>) => {
				const { userHighScore } = action.payload;

				state.requestingSetUserScore = false;
				state.userHighScore = userHighScore;
			}
		},
		receiveUserHighScore: {
			prepare: (userHighScore: any) => {
				return { payload: { userHighScore } };
			},
			reducer: (state: IScoresState, action: PayloadAction<IScoresActionPayload>) => {
				const { userHighScore } = action.payload;

				state.requestingSetUserScore = false;
				state.userHighScore = userHighScore;
			}
		},
		requestHighScores: {
			prepare: (gameModifier: number, gameModeSlug: string, gameContentSlug: string) => {
				return { payload: { gameContentSlug, gameModeSlug, gameModifier } };
			},
			reducer: (state: IScoresState) => {
				state.requestingHighScores = true;
			}
		},
		requestSetUserScore: {
			prepare: (score: number, gameModifier: number, gameModeSlug: string, gameContentSlug: string) => {
				return { payload: { gameContentSlug, gameModeSlug, gameModifier, score } };
			},
			reducer: (state: IScoresState) => {
				state.requestingSetUserScore = true;
			}
		},
		requestUserHighScore: {
			prepare: (gameModifier: number, gameModeSlug: string, gameContentSlug: string) => {
				return { payload: { gameContentSlug, gameModeSlug, gameModifier } };
			},
			reducer: (state: IScoresState) => {
				state.requestingUserHighScore = true;
			}
		},
		resetScores: () => scoresState
	}
});

export const {
	failedReceiveHighScores,
	failedReceiveSetUserScore,
	failedReceiveUserHighScore,
	receiveHighScores,
	receiveSetUserScore,
	receiveUserHighScore,
	requestHighScores,
	requestSetUserScore,
	requestUserHighScore,
	resetScores
} = scoresSlice.actions;

export default scoresSlice.reducer;
