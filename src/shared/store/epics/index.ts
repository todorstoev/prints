import { combineEpics } from 'redux-observable';

import * as authEpics from './auth';

import * as deviceEpics from './devices';

import * as mapEpics from './map';

const combinedEpics = [
  ...Object.values(authEpics),
  ...Object.values(deviceEpics),
  ...Object.values(mapEpics),
];

export const rootEpics = combineEpics(...combinedEpics);
