import { Epic } from 'redux-observable';
import { filter, mergeMap } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';

import { RootState } from '../../../types';
import * as API from '../../services';

import { actions, RootAction } from '..';
import { from, of } from 'rxjs';

export const loadUserRooms: Epic<RootAction, RootAction, RootState, typeof API> = (
  action$,
  state$,
  { getUserRooms },
) =>
  action$.pipe(
    filter(isActionOf(actions.roomRequest)),

    mergeMap((action) => {
      return from(getUserRooms(action.payload)).pipe(
        mergeMap((rooms) => {
          const { auth } = state$.value;

          return of(actions.roomSuccess({ data: rooms, user: auth.user }));
        }),
      );
    }),
  );
