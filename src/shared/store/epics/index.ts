import { combineEpics } from 'redux-observable';

import * as authEpics from './auth';

import * as deviceEpics from './devices';

import * as mapEpics from './map';

import * as chatEpics from './chat';

const combinedEpics = [
  ...Object.values(authEpics),
  ...Object.values(deviceEpics),
  ...Object.values(mapEpics),
  ...Object.values(chatEpics),
];

export const rootEpics = combineEpics(...combinedEpics);
