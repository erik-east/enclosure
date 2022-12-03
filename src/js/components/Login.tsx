import { bindActionCreators } from '@reduxjs/toolkit';
import * as React from 'react';
import { useDispatch } from 'react-redux';

import { requestSetUserScore } from '../redux';

const Login: React.FC = (): JSX.Element => {
	const dispatch = useDispatch();
	const requestSetUserScoreDispatch = bindActionCreators(requestSetUserScore, dispatch);
	const [ score, setScore ] = React.useState(0);

	const handleScoreChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setScore(Number(event.target.value));
	};

	return (
		<div className='login' style={ { padding: '10% 25%' } }>
			<input
				autoFocus
				onChange={ handleScoreChange }
				placeholder='Enter Score'
				spellCheck={ false }
				value={ score } />
			<button disabled={ score <= 0 } onClick={ () => requestSetUserScoreDispatch(score, 5, 'classic', 'south-america') }>Send Score</button>
		</div>
	);
};

export default Login;
