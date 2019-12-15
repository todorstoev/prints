import React from 'react';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import configureStore from './configureStore';

const store = configureStore();

const Root: React.FC<any> = () => (
	<Provider store={store}>
		<Router>
			<App />
		</Router>
	</Provider>
);

export default Root;
