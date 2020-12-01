import { combineEpics } from 'redux-observable';

import * as authEpics from './auth';

import * as deviceEpics from './devices';

const combinedEpics = [...Object.values(authEpics), ...Object.values(deviceEpics)];

export const rootEpics = combineEpics(...combinedEpics);
