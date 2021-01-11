import { createReducer } from 'typesafe-actions';
import { RootAction, actions } from '..';

import { MapState } from '../../../types';

import { convertGeopoint } from '../../helpers';

const initialState: MapState = {
  bounds: { north: convertGeopoint(0, 0), south: convertGeopoint(0, 0) },
  userLoc: convertGeopoint(0, 0),
  isLoading: false,
  filter: null,
};

export const mapReducer = createReducer<MapState, RootAction>(initialState)
  .handleAction(actions.changeMapBounds, (state, action) => {
    return {
      ...state,
      bounds: action.payload,
    };
  })
  .handleAction(actions.changeUserLoc, (state, action) => {
    return {
      ...state,
      userLoc: action.payload,
    };
  })
  .handleAction(actions.requestMapBounds, (state) => {
    return {
      ...state,
      isLoading: true,
    };
  })
  .handleAction(actions.successMapBounds, (state) => {
    return {
      ...state,
      isLoading: false,
    };
  })
  .handleAction(actions.setSearchFilter, (state, action) => {
    return {
      ...state,
      filter: action.payload,
    };
  })
  .handleAction(actions.clearFilter, (state) => {
    return {
      ...state,
      filter: null,
    };
  });
