import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import GameSelection from './GameSelection';
import Leaderboards from './Leaderboards';
import MapComponent from './MapComponent';
import Navbar from './Navbar';
import PolygonGame from './PolygonGame';
import PolygonGameSelection from './PolygonGameSelection';

const Enclosure: React.FC = (): JSX.Element => {
	return (
		<div id='enclosure-container'>
			<Navbar />

			<div className="container">
				<Routes>
					<Route path='game/*' element={ <MapComponent /> }>
						<Route index element={ <GameSelection /> } />

						<Route path='polygon'>
							<Route index element={ <PolygonGameSelection /> } />
							<Route path=':id' element={ <PolygonGame /> } />
							<Route path="*" element={ <Navigate replace to={ '/game/polygon/10' } /> } />
						</Route>

						<Route path="*" element={ <Navigate replace to={ '/game' } /> } />
					</Route>

					<Route path='leaderboards' element={ <Leaderboards /> } />
					<Route path="*" element={ <Navigate replace to={ '/game' } /> } />
				</Routes>
			</div>
		</div>
	);
};

export default Enclosure;
