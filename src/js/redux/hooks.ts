import {
	TypedUseSelectorHook,
	useDispatch,
	useSelector
} from 'react-redux';

import type { AppDispatch, IEnclosureState } from './store';

// Use these throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<IEnclosureState> = useSelector;
