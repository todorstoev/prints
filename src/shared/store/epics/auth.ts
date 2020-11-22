import { from, of, zip } from 'rxjs';
import { catchError, exhaustMap, filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { Epic } from 'redux-observable';

import * as API from '../../services';

import { actions, RootAction } from '..';

import { Device, PrintsUser, RoomData, RootState } from '../../../types';
import { Vote } from '../../../components/ChatRoomDetails';

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
          ).pipe(
            exhaustMap(() =>
              of(
                actions.receiveLogin(user),
                actions.getDevicesFromLogin(user.devices as Device[]),
                actions.clearAuthErrors(),
              ),
            ),
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
  { updateUser, localStorageSet },
) =>
  action$.pipe(
    filter(isActionOf(actions.updateUserRequest)),
    mergeMap((action) => {
      const { user, data } = action.payload;

      return from(updateUser(user, data)).pipe(
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
          ).pipe(
            exhaustMap(() =>
              of(
                actions.recieveSsoLogin(user),
                actions.getDevicesFromLogin(user.devices as Device[]),
                actions.clearAuthErrors(),
              ),
            ),
          ),
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
            actions.getDevicesFromLogin(user.devices as Device[]),
            actions.verifySuccess(),
          ),
        ),
      ),
    ),
    catchError((e) => of(actions.verifySuccess(), actions.receiveLogout())),
  );

export const voteUser: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  state$,
  { voteUser, updateUserRoom },
) =>
  action$.pipe(
    filter(isActionOf(actions.voteUserRequest)),
    exhaustMap((action) => {
      let { user } = state$.value.auth;

      const { roomData } = action.payload;

      const direction = action.payload.vote;

      let { rating } = action.payload.roomData.data;

      let newRating = rating[user.uid as string];

      const contactUserId: string = Object.keys(rating).filter((r) => r !== user.uid)[0];

      if (direction === Vote.Up) {
        newRating++;
      } else {
        newRating--;
      }

      const newRoomData: RoomData = {
        ...roomData,
        data: {
          ...roomData.data,
          rating: {
            ...roomData.data.rating,
            [`${user.uid}`]: newRating,
          },
          voted: {
            ...roomData.data.voted,
            [`${user.uid}`]: true,
          },
        },
      };

      return from(voteUser(contactUserId as string, newRating as number)).pipe(
        mergeMap(() => {
          return from(updateUserRoom(newRoomData)).pipe(
            mergeMap(() =>
              of(
                actions.voteUserSuccess(),
                actions.setCanVote(false),
                actions.addNotification('User is Rated'),
              ),
            ),
          );
        }),
      );
    }),
    catchError((e) => {
      return of(actions.addNotification(e));
    }),
  );
