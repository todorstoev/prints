import { createReducer } from 'typesafe-actions';
import { RootAction, actions } from '..';

import { MapState } from '../../../types';

import { convertGeopoint } from '../../helpers';

const initialState: MapState = {
  center: convertGeopoint(0, 0),
  userLoc: convertGeopoint(0, 0),
  isLoading: false,
};

export const mapReducer = createReducer<MapState, RootAction>(initialState)
  .handleAction(actions.changeUserLoc, (state, action) => {
    return {
      ...state,
      userLoc: action.payload,
    };
  })
  .handleAction(actions.clearFilter, (state) => {
    return {
      ...state,
      filter: null,
    };
  })
  .handleAction(actions.setCenter, (state, action) => {
    return {
      ...state,
      center: action.payload,
    };
  });
