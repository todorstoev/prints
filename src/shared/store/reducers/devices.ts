import { createReducer } from 'typesafe-actions';

import { DeviceState } from '../../../types';

import { RootAction, actions } from '..';
import { remove } from 'lodash';

const initialState: DeviceState = {
  userDevices: [],
  allDevices: [],
  isLoading: false,
};

export const deviceReducer = createReducer<DeviceState, RootAction>(initialState)
  .handleAction(actions.requestAddDevice, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(actions.successAddDevice, (state, action) => ({
    ...state,
    isLoading: false,
    userDevices: [...state.userDevices, action.payload],
  }))
  .handleAction(actions.requestDeleteDevice, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(actions.successDeleteDevice, (state, action) => {
    remove(state.userDevices, (d) => d.id === action.payload.id);

    return {
      ...state,
      isLoading: false,
      userDevices: state.userDevices,
    };
  })
  .handleAction(actions.requestLoadUserDevices, (state, action) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(actions.successLoadUserDevices, (state, action) => ({
    ...state,
    isLoading: false,
    userDevices: action.payload,
  }))
  .handleAction(actions.clearDevices, (state, action) => ({
    ...state,
    userDevices: [],
  }));
