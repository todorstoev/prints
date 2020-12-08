import { Epic } from 'redux-observable';
import { catchError, filter, mapTo, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { RootState } from '../../../types';
import * as API from '../../services';

import { actions, RootAction } from '..';
import { from, of } from 'rxjs';

export const loadUserDevices: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  state$,
  { loadUserDevicesService },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestLoadUserDevices)),

    mapTo(actions.clearDevices()),

    mergeMap((res) => {
      debugger;
      const { auth } = state$.value;

      return from(loadUserDevicesService(auth.user)).pipe(
        mergeMap((devices) => of(actions.successLoadUserDevices(devices))),
      );
    }),
  );

export const addDeviceEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { addDevice },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestAddDevice)),
    mergeMap((action) => {
      const { payload } = action;

      return from(addDevice(payload)).pipe(
        mergeMap((device) =>
          of(
            actions.successAddDevice(device),
            actions.addNotification(`Device ${action.payload.brand} added`),
          ),
        ),
      );
    }),
  );

export const remmoveDeviceEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { removeDevice },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestDeleteDevice)),
    mergeMap((action) =>
      from(removeDevice(action.payload)).pipe(
        mergeMap((deletedDevice) => {
          return of(
            actions.successDeleteDevice(deletedDevice),
            actions.addNotification(`Removed ${deletedDevice.brand} ${deletedDevice.model}`),
          );
        }),
      ),
    ),

    catchError((e) => of(actions.recieveDeviceError(e))),
  );
