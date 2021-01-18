import { Epic } from 'redux-observable';

import { filter, map, delay, mergeMap } from 'rxjs/operators';

import { isActionOf } from 'typesafe-actions';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { RootState } from '../../../types';
import { from, of } from 'rxjs';

export const retrieveDevicesFromUserLoc: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { loadDevicesService },
) =>
  action$.pipe(
    filter(isActionOf(actions.changeUserLoc)),
    mergeMap((action) => {
      return from(loadDevicesService(action.payload)).pipe(
        mergeMap((res) =>
          of(
            actions.setDevicesAround(res),
            // actions.addNotification(`Found ${res.length} device${res.length === 1 ? '' : 's'}`),
          ),
        ),
      );
    }),
  );

export const retrieveDevicesFromNewCenter: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { loadDevicesService },
) =>
  action$.pipe(
    filter(isActionOf(actions.setCenter)),
    mergeMap((action) => {
      return from(loadDevicesService(action.payload)).pipe(
        mergeMap((res) => of(actions.setDevicesAround(res))),
      );
    }),
  );

export const filterDevices: Epic<RootAction, RootAction, RootState, typeof API> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.setSearchFilter)),
    delay(100),
    map((res) => {
      return actions.filterDevices(res.payload);
    }),
  );

export const resetFilter: Epic<RootAction, RootAction, RootState, typeof API> = (action$) =>
  action$.pipe(
    filter(isActionOf(actions.clearFilter)),
    delay(100),
    map((res) => {
      return actions.filterDevices(null);
    }),
  );
