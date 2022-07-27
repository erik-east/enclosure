import * as React from 'react';
import { MapProvider } from 'react-map-gl';
import { Routes, Route, Navigate } from 'react-router-dom';

import ClassicModeGameSelection from './ClassicModeGameSelection';
import ClueModeGameSelection from './ClueModeGameSelection';
import GameSelection from './GameSelection';
import Leaderboards from './Leaderboards';
import MapComponent from './MapComponent';
import MemorizeModeGameSelection from './MemorizeModeGameSelection';
import Navbar from './Navbar';
import PolygonGame from './PolygonGame';

const Enclosure: React.FC = (): JSX.Element => {
	return (
		<div id='enclosure-container'>
			<Navbar />

			<div className="container">
				<MapProvider>
					<Routes>
						<Route path='game/*' element={ <MapComponent /> }>
							<Route index element={ <GameSelection /> } />

							<Route path='classic'>
								<Route index element={ <ClassicModeGameSelection /> } />
								<Route path=':content/:id' element={ <PolygonGame /> } />
								<Route path="*" element={ <Navigate replace to={ '/game/classic' } /> } />
							</Route>

							<Route path='clue'>
								<Route index element={ <ClueModeGameSelection /> } />
								<Route path=':content/:id' element={ <PolygonGame clueMode /> } />
								<Route path="*" element={ <Navigate replace to={ '/game/clue' } /> } />
							</Route>

							<Route path='memorize'>
								<Route index element={ <MemorizeModeGameSelection /> } />
								<Route path=':content/:id' element={ <PolygonGame memorizeMode /> } />
								<Route path="*" element={ <Navigate replace to={ '/game/memorize' } /> } />
							</Route>

							<Route path="*" element={ <Navigate replace to={ '/game' } /> } />
						</Route>

						<Route path='leaderboards' element={ <Leaderboards /> } />
						<Route path="*" element={ <Navigate replace to={ '/game' } /> } />
					</Routes>
				</MapProvider>
			</div>
		</div>
	);
};

export default Enclosure;
