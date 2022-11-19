import { bindActionCreators } from '@reduxjs/toolkit';
import { getTheme } from '@table-library/react-table-library/baseline';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Select from 'react-select';

import { useReduxState } from '../lib/redux';
import { requestHighScores } from '../redux';

import { IScoresState } from 'js/types';

const gameModeOptions = [
	{ label: 'Classic Mode', value: 'classic' },
	{ label: 'Clue Mode', value: 'clue' },
	{ label: 'Memorize Mode', value: 'memorize' }
];
const defaultClueModeOptions = [
	{ label: 'Easy', value: 100 },
	{ label: 'Medium', value: 200 },
	{ label: 'Hard', value: 300 }
];
const defaultMemorizeModeOptions = [
	{ label: '3', value: 3 },
	{ label: '6', value: 6 },
	{ label: '9', value: 9 }
];
const gameContentOptions = [
	{
		label: 'US States',
		modifierOptions: {
			classic: [
				{ label: '5', value: 5 },
				{ label: '10', value: 10 },
				{ label: '25', value: 25 },
				{ label: '50', value: 50 }
			],
			clue: JSON.parse(JSON.stringify(defaultClueModeOptions)),
			memorize: JSON.parse(JSON.stringify(defaultMemorizeModeOptions))
		},
		value: 'us-states'
	},
	{
		label: 'Europe',
		modifierOptions: {
			classic: [
				{ label: '5', value: 5 },
				{ label: '10', value: 10 },
				{ label: '20', value: 20 },
				{ label: '38', value: 38 }
			],
			clue: JSON.parse(JSON.stringify(defaultClueModeOptions)),
			memorize: JSON.parse(JSON.stringify(defaultMemorizeModeOptions))
		},
		value: 'europe'
	},
	{
		label: 'South America',
		modifierOptions: {
			classic: [
				{ label: '5', value: 5 },
				{ label: '10', value: 10 },
				{ label: '13', value: 13 }
			],
			clue: JSON.parse(JSON.stringify(defaultClueModeOptions)),
			memorize: JSON.parse(JSON.stringify(defaultMemorizeModeOptions))
		},
		value: 'south-america'
	}
];

const baseStyles = {
	container: (styles): Record<string, string> => ({
		...styles,
		fontSize: '18px',
		minWidth: '160px',
		pointerEvents: 'auto',
		textAlign: 'center'
	}),
	menu: (styles): Record<string, string> => ({
		...styles,
		border: '1px solid rgba(0,0,0,.15)',
		borderRadius: '2px',
		boxShadow: 'none',
		margin: '4px 0',
		minWidth: '160px'
	}),
	option: (styles, state): Record<string, string> => ({
		...styles,
		'&:hover': {
			backgroundColor: '#E9ECEF',
			cursor: 'pointer'
		},
		backgroundColor: 'transparent',
		color: state.isSelected ? '#78CCE2' : '##002439',
		fontSize: '16px',
		pointerEvents: state.isSelected ? 'none' : 'auto',
		textAlign: 'center'
	}),
	placeholder: (styles): Record<string, string> => ({
		...styles,
		fontSize: '20px',
		margin: '0'
	})
};
const modifierDropdownStyles = {
	container: (styles): Record<string, string> => ({
		...styles,
		fontSize: '18px',
		minWidth: '100px',
		pointerEvents: 'auto',
		textAlign: 'center'
	}),
	menu: (styles): Record<string, string> => ({
		...styles,
		border: '1px solid rgba(0,0,0,.15)',
		borderRadius: '2px',
		boxShadow: 'none',
		margin: '4px 0',
		minWidth: '100px'
	})
};

const Leaderboards: React.FC = (): JSX.Element => {
	const dispatch = useDispatch();
	const [ gameMode, setGameMode ] = React.useState(gameModeOptions[ 0 ]);
	const [ gameContent, setGameContent ] = React.useState(gameContentOptions[ 0 ]);
	const firstModifierOption = gameContentOptions[ 0 ].modifierOptions[ gameModeOptions[ 0 ].value ][ 0 ];
	const [ gameModifier, setGameModifier ] = React.useState(firstModifierOption);
	const { highScores } = useReduxState<IScoresState>('scores');
	const requestHighScoresDispatch = bindActionCreators(requestHighScores, dispatch);
	const theme = useTheme([
		getTheme(),
		{
			Table: '--data-table-library_grid-template-columns: minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr);'
		}
	]);
	const COLUMNS = [
		{ label: 'Rank', renderCell: (item) => item.rank },
		{ label: 'Username', renderCell: (item) => item.username },
		{ label: 'Date', renderCell: (item) => item.date },
		{ label: 'Score', renderCell: (item) => item.score }
	];
	const data = {
		// eslint-disable-next-line no-nested-ternary, sort-keys
		nodes: highScores ? (highScores.length > 0 ? highScores : [ { id: 'no-scores', rank: 1, score: 9999, date: 'be you!', username: 'This could' } ]) : [ ]
	};

	useEffect(() => {
		setGameModifier(gameContent.modifierOptions[ gameMode.value ][ 0 ]);
	}, [ gameMode, gameContent ]);

	useEffect(() => {
		requestHighScoresDispatch(gameModifier.value, gameMode.value, gameContent.value);
	}, [ gameModifier ]);

	return (
		<div className='leaderboards'>
			<div className='title'>
				Leaderboards
			</div>

			<div className='options'>
				<Select
					isSearchable={ false }
					onChange={ (selectedMode) => setGameMode(selectedMode) }
					options={ gameModeOptions }
					placeholder='Game Mode'
					styles={ baseStyles }
					value={ gameMode } />

				<Select
					isSearchable={ false }
					onChange={ (selectedContent) => setGameContent(selectedContent) }
					options={ gameContentOptions }
					placeholder='Game Content'
					styles={ baseStyles }
					value={ gameContent } />

				<Select
					isSearchable={ false }
					onChange={ (selectedModifier) => setGameModifier(selectedModifier) }
					options={ gameContent.modifierOptions[ gameMode.value ] }
					placeholder='Modifier'
					styles={ { ...baseStyles, ...modifierDropdownStyles } }
					value={ gameModifier } />
			</div>

			<CompactTable
				columns={ COLUMNS }
				data={ data }
				layout={ { custom: true } }
				theme={ theme } />
		</div>
	);
};

export default Leaderboards;
