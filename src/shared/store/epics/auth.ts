import { from, of } from 'rxjs';
import { catchError, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { Epic } from 'redux-observable';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { RootState } from '../../../types';

export const registerUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { registerWithEmail },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestRegister)),

    mergeMap((action) => {
      const { email, password } = action.payload;

      return from(registerWithEmail(email, password)).pipe(
        mergeMap((user) => of(actions.recieveRegister(user), actions.clearAuthErrors())),
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
  { loginWithEmail },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestLogin)),
    mergeMap((action) => {
      const { email, password, remember } = action.payload;

      return from(loginWithEmail(email, password, remember)).pipe(
        mergeMap((user) => of(actions.receiveLogin(user), actions.clearAuthErrors())),
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
  { updateUser },
) =>
  action$.pipe(
    filter(isActionOf(actions.updateUserRequest)),
    mergeMap((action) => {
      const { ...data } = action.payload;

      return from(updateUser(data)).pipe(
        mergeMap((res) =>
          of(actions.updateUserSuccess(res), actions.addNotification('User Updated')),
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
  { loginWithSsoFinish },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestSsoLogin)),
    exhaustMap(() => {
      return from(loginWithSsoFinish()).pipe(
        mergeMap((user) => of(actions.recieveSsoLogin(user), actions.clearAuthErrors())),
      );
    }),
  );

export const logoutUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { logoutUser },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestLogout)),
    mergeMap(() =>
      from(logoutUser()).pipe(
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

export const deleteUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { deleteUser },
) =>
  action$.pipe(
    filter(isActionOf(actions.deleteUserRequest)),
    mergeMap(() =>
      from(deleteUser()).pipe(
        mergeMap((res) =>
          of(actions.deleteUserSuccess(), actions.addNotification('User deleted!')),
        ),
      ),
    ),
    catchError((e) => of(actions.addNotification(e))),
  );

export const verifyUserEpic: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  _state$,
  { getCurrentUser },
) =>
  action$.pipe(
    filter(isActionOf(actions.verifyUserRequest)),
    mergeMap(() =>
      getCurrentUser().pipe(
        mergeMap((user) => {
          if (user) return of(actions.verifyUserSuccess(user));

          return of(actions.verifyUserCancel());
        }),
      ),
    ),
    catchError((e) => of(actions.receiveLogout(), actions.addNotification(e))),
  );
