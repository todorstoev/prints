import { createAction } from 'typesafe-actions';
import { IMapFilter } from '../../../types';

import { CHANGE_USER_LOC, CLEAR_FILTERS, SET_CENTER, SET_SEARCH_FILTER } from '../constants';

export const changeUserLoc = createAction(CHANGE_USER_LOC)<firebase.firestore.GeoPoint>();

export const setCenter = createAction(SET_CENTER)<firebase.firestore.GeoPoint>();

export const setSearchFilter = createAction(SET_SEARCH_FILTER)<IMapFilter>();

export const clearFilter = createAction(CLEAR_FILTERS)();
