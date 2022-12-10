import * as React from 'react';
import { MapProvider } from 'react-map-gl';
import { Routes, Route, Navigate } from 'react-router-dom';

import ClassicModeGameSelection from './ClassicModeGameSelection';
import ClueModeGameSelection from './ClueModeGameSelection';
import GameSelection from './GameSelection';
import Leaderboards from './Leaderboards';
import Login from './Login';
import MapComponent from './MapComponent';
import MemorizeModeGameSelection from './MemorizeModeGameSelection';
import Navbar from './Navbar';
import PolygonGame from './PolygonGame';

const Enclosure: React.FC = (): JSX.Element => {
	const [ signInModalVisibility, setSignInModalVisibility ] = React.useState<boolean>(false);

	return (
		<div id='enclosure-container'>
			<Navbar
				signInModalVisibility={ signInModalVisibility }
				setSignInModalVisibility={ setSignInModalVisibility } />

			<div className="container">
				<MapProvider>
					<Routes>
						<Route path='*' element={ <MapComponent /> }>
							<Route index element={ <GameSelection /> } />

							<Route path='classic'>
								<Route index element={ <ClassicModeGameSelection /> } />
								<Route path=':content/:id' element={ <PolygonGame setSignInModalVisibility={ setSignInModalVisibility } /> } />
								<Route path="*" element={ <Navigate replace to={ '/classic' } /> } />
							</Route>

							<Route path='clue'>
								<Route index element={ <ClueModeGameSelection /> } />
								<Route path=':content/:id' element={ <PolygonGame clueMode setSignInModalVisibility={ setSignInModalVisibility } /> } />
								<Route path="*" element={ <Navigate replace to={ '/clue' } /> } />
							</Route>

							<Route path='memorize'>
								<Route index element={ <MemorizeModeGameSelection /> } />
								<Route path=':content/:id' element={ <PolygonGame memorizeMode setSignInModalVisibility={ setSignInModalVisibility } /> } />
								<Route path="*" element={ <Navigate replace to={ '/memorize' } /> } />
							</Route>

							<Route path="*" element={ <Navigate replace to={ '/' } /> } />
						</Route>

						<Route path='leaderboards' element={ <Leaderboards /> } />

						<Route path='login' element={ <Login /> } />
					</Routes>
				</MapProvider>
			</div>
		</div>
	);
};

export default Enclosure;
