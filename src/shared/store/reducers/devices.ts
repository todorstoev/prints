import { createReducer } from 'typesafe-actions';

import { Device, DeviceState } from '../../../types';

import { RootAction, actions } from '..';
import { remove, filter } from 'lodash';

const initialState: DeviceState = {
  userDevices: [],
  filteredDevices: null,
  allDevices: null,
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
  .handleAction(actions.cancelDeleteDevice, (state) => ({
    ...state,
    isLoading: false,
  }))
  .handleAction(actions.requestLoadUserDevices, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(actions.successLoadUserDevices, (state, action) => ({
    ...state,
    isLoading: false,
    userDevices: action.payload,
  }))
  .handleAction(actions.clearDevices, (state) => ({
    ...state,
    userDevices: [],
  }))
  .handleAction(actions.setDevicesAround, (state, action) => ({
    ...state,
    allDevices: action.payload,
  }))
  .handleAction(actions.filterDevices, (state, action) => {
    const filters = action.payload;

    if (!filters)
      return {
        ...state,
        filteredDevices: null,
      };

    if (filters && typeof filters.type === 'string' && filters.type.length === 0)
      delete filters.type;

    if (filters && typeof filters.brand === 'string' && filters.brand.length === 0)
      delete filters.brand;

    if (filters && typeof filters.model === 'string' && filters.model.length === 0)
      delete filters.model;

    const filteredDevices = filter(state.allDevices, filters) as Device[];

    return {
      ...state,
      filteredDevices,
    };
  });
