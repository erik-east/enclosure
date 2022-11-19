import { useAppDispatch, useAppSelector } from './hooks';
import store, { IEnclosureState } from './store';

export {
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
