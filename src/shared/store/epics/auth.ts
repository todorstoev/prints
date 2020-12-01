import { from, of, zip } from 'rxjs';
import { catchError, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { Epic } from 'redux-observable';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { PrintsUser, RootState } from '../../../types';

export const registerUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { registerWithEmail, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestRegister)),

    mergeMap((action) => {
      const { email, password } = action.payload;

      return from(registerWithEmail(email, password)).pipe(
        mergeMap((user) =>
          zip(
            localStorageSet<PrintsUser>('user', user),
            localStorageSet<string>('persistance', 'local'),
          ).pipe(mergeMap(() => of(actions.recieveRegister(user), actions.clearAuthErrors()))),
        ),
        catchError((error: string) =>
          of(
            actions.recieveAuthError({
              code: 'FbError',
              message: error,
            }),
            actions.cancelRegister(),
          ),
        ),
      );
    }),
  );

export const loginUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { loginWithEmail, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestLogin)),
    mergeMap((action) => {
      const { email, password, remember } = action.payload;

      return from(loginWithEmail(email, password, remember)).pipe(
        mergeMap((user) => {
          return zip(
            localStorageSet<PrintsUser>('user', user),
            localStorageSet<string>('persistance', remember ? 'local' : 'none'),
          ).pipe(exhaustMap(() => of(actions.receiveLogin(user), actions.clearAuthErrors())));
        }),
        catchError((error: string) =>
          of(
            actions.recieveAuthError({
              code: 'FbError',
              message: error,
            }),
            actions.cancelLogin(),
          ),
        ),
      );
    }),
  );

export const updateUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { updateUser, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.updateUserRequest)),
    mergeMap((action) => {
      const { ...data } = action.payload;

      return from(updateUser(data)).pipe(
        mergeMap((res) =>
          localStorageSet('user', res).pipe(
            exhaustMap(() =>
              of(actions.updateUserSuccess(res), actions.addNotification('User Updated')),
            ),
          ),
        ),
        catchError((e) => {
          return of(actions.recieveAuthError(e), actions.addNotification(e));
        }),
      );
    }),
  );

export const loginSSOEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { loginWithSsoFinish, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestSsoLogin)),
    exhaustMap(() => {
      return from(loginWithSsoFinish()).pipe(
        mergeMap((user) =>
          zip(
            localStorageSet<PrintsUser>('user', user),
            localStorageSet('persistance', 'local'),
          ).pipe(exhaustMap(() => of(actions.recieveSsoLogin(user), actions.clearAuthErrors()))),
        ),
      );
    }),
  );

export const logoutUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { logoutUser, localStorageRemove },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestLogout)),
    mergeMap(() =>
      zip(from(logoutUser()), localStorageRemove('user'), localStorageRemove('persistance')).pipe(
        mergeMap(() =>
          of(
            actions.receiveLogout(),
            actions.clearAuthErrors(),
            actions.addNotification('Successfully logged out'),
          ),
        ),
        catchError((error: string) =>
          of(
            actions.recieveAuthError({
              code: 'FbError',
              message: error,
            }),
          ),
        ),
      ),
    ),
  );

export const verifyRequestEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { localStorageGet },
) =>
  action$.pipe(
    filter(isActionOf(actions.verifyRequest)),
    mergeMap(() =>
      localStorageGet<PrintsUser>('user').pipe(
        mergeMap((user) =>
          of(
            actions.receiveLogin(user),
            // actions.getDevicesFromLogin(user.devices as Device[]),
            actions.verifySuccess(),
          ),
        ),
      ),
    ),
    catchError((e) => of(actions.verifySuccess(), actions.receiveLogout())),
  );
