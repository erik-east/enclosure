import { get, isEqual } from 'lodash';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export const usePrevious = <T>(value: T): T | undefined => {
	const ref = useRef<T>();

	useEffect(() => {
		ref.current = value;
	}, [ value ]);

	return ref.current;
};

export const useReduxState = <T>(stateSelector: string): T => {
	let state: any;

	if (stateSelector.indexOf('.') === -1) {
		state = useSelector((reduxState: unknown) => (reduxState[ stateSelector ]), isEqual);
	}
	else {
		state = useSelector((reduxState: unknown) => (get(reduxState, stateSelector)));
	}

	return state;
};
