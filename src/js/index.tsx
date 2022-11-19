import '../css/index.scss';

import { ChakraProvider } from '@chakra-ui/react';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import Enclosure from './components/Enclosure';
import { store } from './redux';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const container = document.getElementById('root-container');
const root = createRoot(container!);
/* eslint-enable @typescript-eslint/no-non-null-assertion */

root.render(
	<Provider store={ store }>
		<BrowserRouter>
			<ChakraProvider>
				<Enclosure />
			</ChakraProvider>
		</BrowserRouter>
	</Provider>
);
