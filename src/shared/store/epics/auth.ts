import { from, of } from 'rxjs';
import { catchError, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { Epic } from 'redux-observable';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { Device, RoomData, RootState } from '../../../types';
import { Vote } from '../../../components/ChatRoomDetails';

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
        mergeMap((user) =>
          of(
            actions.recieveRegister(user),
            // actions.getDevicesFromLogin(user.devices as Device[]),
            actions.clearAuthErrors(),
          ),
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
  { loginWithEmail },
) =>
  action$.pipe(
    filter(isActionOf(actions.requestLogin)),
    mergeMap((action) => {
      const { email, password, remember } = action.payload;

      return from(loginWithEmail(email, password, remember)).pipe(
        mergeMap((user) => {
          return of(
            actions.receiveLogin(user),
            actions.getDevicesFromLogin(user.devices as Device[]),
            actions.clearAuthErrors(),
          );
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
  { updateUser },
) =>
  action$.pipe(
    filter(isActionOf(actions.updateUserRequest)),
    mergeMap((action) => {
      const { user, data } = action.payload;

      return from(updateUser(user, data)).pipe(
        mergeMap((res) => {
          return of(actions.updateUserSuccess(res), actions.addNotification('User Updated'));
        }),
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
        mergeMap((user) => {
          return of(
            actions.recieveSsoLogin(user),
            actions.getDevicesFromLogin(user.devices as Device[]),
            actions.clearAuthErrors(),
          );
        }),
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
        mergeMap(() => {
          return of(
            actions.receiveLogout(),
            actions.clearAuthErrors(),
            actions.addNotification('Successfully logged out'),
          );
        }),
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
  { getCurrentUser, getUserFromDb },
) =>
  action$.pipe(
    filter(isActionOf(actions.verifyRequest)),

    mergeMap(() => {
      return getCurrentUser().pipe(
        mergeMap((user) => {
          return from(getUserFromDb(user.uid)).pipe(
            mergeMap((userFromDb) =>
              of(
                actions.receiveLogin(userFromDb),
                actions.getDevicesFromLogin(userFromDb.devices),
                actions.verifySuccess(),
              ),
            ),
          );
        }),
        catchError((e) => {
          return of(actions.verifySuccess(), actions.receiveLogout());
        }),
      );
    }),
  );

export const voteUser: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  state$,
  { voteUser, updateUserRoom },
) =>
  action$.pipe(
    filter(isActionOf(actions.voteUserRequest)),
    exhaustMap((action) => {
      const direction = action.payload.vote;

      let { rating, id: uid } = action.payload.roomData.data.chatDevice;

      const { roomData } = action.payload;

      const { user } = state$.value.auth;

      const newRoomData: RoomData = {
        ...roomData,
        data: {
          ...roomData.data,
          chatDevice: {
            ...roomData.data.chatDevice,
            rating,
          },
          voted: [...roomData.data.voted, user.uid as string],
        },
      };

      if (direction === Vote.Up) {
        (rating as number)++;
      } else {
        (rating as number)--;
      }

      return from(voteUser(uid as string, rating as number)).pipe(
        mergeMap(() => {
          return from(updateUserRoom(newRoomData)).pipe(
            mergeMap(() => of(actions.voteUserSuccess())),
          );
        }),
      );
    }),
    catchError((e) => {
      return of(actions.addNotification(e));
    }),
  );
