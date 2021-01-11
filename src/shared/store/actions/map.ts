import { createAction } from 'typesafe-actions';
import { IMapFilter } from '../../../types';

import {
  CHANGE_MAP_BOUNDS,
  CHANGE_USER_LOC,
  CLEAR_FILTERS,
  REQUEST_MAP_BOUNDS,
  SET_SEARCH_FILTER,
  SUCCESS_MAP_BOUNDS,
} from '../constants';

export const changeMapBounds = createAction(CHANGE_MAP_BOUNDS)<{
  north: firebase.firestore.GeoPoint;
  south: firebase.firestore.GeoPoint;
}>();

export const changeUserLoc = createAction(CHANGE_USER_LOC)<firebase.firestore.GeoPoint>();

export const requestMapBounds = createAction(REQUEST_MAP_BOUNDS)();

export const successMapBounds = createAction(SUCCESS_MAP_BOUNDS)();

export const setSearchFilter = createAction(SET_SEARCH_FILTER)<IMapFilter>();

export const clearFilter = createAction(CLEAR_FILTERS)();
