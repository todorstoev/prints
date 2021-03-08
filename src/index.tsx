import React from 'react';
import ReactDOM from 'react-dom';

import Root from './Root';

import 'leaflet/dist/leaflet.css';

import 'react-leaflet-markercluster/dist/styles.min.css';

import './index.css';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { messaging } from './shared/services/firebase';

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorkerRegistration.register();
