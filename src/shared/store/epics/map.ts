import { Epic } from 'redux-observable';

import { delay, filter, mapTo, mergeMap } from 'rxjs/operators';

import { isActionOf } from 'typesafe-actions';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { RootState } from '../../../types';
import { of } from 'rxjs';

export const retrieveNewMapBounds: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
) =>
  action$.pipe(
    filter(isActionOf(actions.requestMapBounds)),
    delay(500),
    mergeMap(() => of(actions.successMapBounds())),
  );
