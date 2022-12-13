import { all } from 'redux-saga/effects';

import {
	watchRequestRemoveServerSideCookie,
	watchRequestSetServerSideCookie
} from './auth/sagas';
import {
	watchRequestHighScores,
	watchRequestSetUserScore,
	watchRequestUserHighScore
} from './scores/sagas';

export default function* sagas(): any {
	yield all([
		watchRequestHighScores(),
		watchRequestRemoveServerSideCookie(),
		watchRequestSetUserScore(),
		watchRequestSetServerSideCookie(),
		watchRequestUserHighScore()
	]);
}
