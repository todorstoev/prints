import { createReducer } from 'typesafe-actions';

import { DeviceState } from '../../../types';

import { RootAction, actions } from '..';

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
  .handleAction(actions.successDeleteDevice, (state, action) => ({
    ...state,
    isLoading: false,
    userDevices: action.payload,
  }))
  .handleAction(actions.getDevicesFromLogin, (state, action) => ({
    ...state,
    userDevices: action.payload,
  }));
