import '../css/index.scss';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import Enclosure from './components/Enclosure';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const container = document.getElementById('root-container');
const root = createRoot(container!);
/* eslint-enable @typescript-eslint/no-non-null-assertion */

root.render(
	<BrowserRouter>
		<Enclosure />
	</BrowserRouter>
);
