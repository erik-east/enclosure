import { all } from 'redux-saga/effects';

import {
	watchRequestCreateUser,
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
		watchRequestCreateUser(),
		watchRequestHighScores(),
		watchRequestRemoveServerSideCookie(),
		watchRequestSetUserScore(),
		watchRequestSetServerSideCookie(),
		watchRequestUserHighScore()
	]);
}
