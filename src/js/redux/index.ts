import { useAppDispatch, useAppSelector } from './hooks';
import store, { IEnclosureState } from './store';

export {
	requestCreateUser,
	requestRemoveServerSideCookie,
	requestSetServerSideCookie,
	resetAuth
} from './auth/slice';

export {
	requestHighScores,
	requestSetUserScore,
	requestUserHighScore,
	resetScores
} from './scores/slice';

export { resetApplication, setMobile } from './application/slice';

export {
	store,
	useAppDispatch,
	useAppSelector
};

export type { IEnclosureState };
