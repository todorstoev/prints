import { Epic } from 'redux-observable';
import { catchError, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { Device, PrintsUser, RootState } from '../../../types';
import * as API from '../../services';

import { actions, RootAction } from '..';
import { from, of } from 'rxjs';

export const addDeviceEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  state$,
  { updatePrintsUserDB, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestAddDevice)),
    exhaustMap((action) => {
      const { auth } = state$.value;

      const userWithNewPritner: PrintsUser = {
        ...auth.user,
        devices: [...(auth.user.devices as Device[]), action.payload],
      };

      return from(updatePrintsUserDB(userWithNewPritner)).pipe(
        exhaustMap((updatedUserWithPrinter) =>
          localStorageSet<PrintsUser>('user', updatedUserWithPrinter).pipe(
            mergeMap(() =>
              of(
                actions.successAddDevice(action.payload),
                actions.addNotification(`Device ${action.payload.brand} added`),
              ),
            ),
          ),
        ),
        catchError((error) => of(actions.recieveDeviceError(error))),
      );
    }),
  );

export const remmoveDeviceEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  state$,
  { updatePrintsUserDB, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestDeleteDevice)),
    mergeMap((action) => {
      const { devices, auth } = state$.value;

      const removedDevice = devices.userDevices.splice(action.payload, 1);

      auth.user.devices = devices.userDevices;

      return from(updatePrintsUserDB(auth.user)).pipe(
        mergeMap((user) =>
          localStorageSet<PrintsUser>('user', user).pipe(
            mergeMap(() =>
              of(
                actions.successDeleteDevice(devices.userDevices),
                actions.addNotification(`Removed ${removedDevice[0].brand}`),
              ),
            ),
          ),
        ),
      );
    }),
    catchError((e) => of(actions.recieveDeviceError(e))),
  );
