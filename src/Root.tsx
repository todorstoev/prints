import React from 'react';
import { ThemeProvider } from 'emotion-theming';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import configureStore from './shared/store';
import { theme } from './theme';

const store = configureStore();

const Root: React.FC<any> = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </Provider>
);

export default Root;
