import { Epic } from 'redux-observable';

import { delay, filter, mapTo } from 'rxjs/operators';

import { isActionOf } from 'typesafe-actions';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { RootState } from '../../../types';

export const retrieveNewMapBounds: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
) =>
  action$.pipe(
    filter(isActionOf(actions.requestMapBounds)),
    delay(500),
    mapTo(actions.successMapBounds()),
  );
