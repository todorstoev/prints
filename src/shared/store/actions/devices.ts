import { createAction } from 'typesafe-actions';

import { Device } from '../../../types';

import {
  CLEAR_DEVICES,
  REQUEST_DEVICE_ADD,
  REQUEST_DEVICE_REMOVE,
  REQUEST_LOAD_DEVICES,
  SUCCESS_DEVICE_ADD,
  SUCCESS_DEVICE_REMOVE,
  SUCCESS_LOAD_DEVICES,
} from '../constants';

export const requestAddDevice = createAction(REQUEST_DEVICE_ADD)<Device>();

export const successAddDevice = createAction(SUCCESS_DEVICE_ADD)<Device>();

export const requestDeleteDevice = createAction(REQUEST_DEVICE_REMOVE)<Device>();

export const successDeleteDevice = createAction(SUCCESS_DEVICE_REMOVE)<Device>();

export const requestLoadUserDevices = createAction(REQUEST_LOAD_DEVICES)();

export const successLoadUserDevices = createAction(SUCCESS_LOAD_DEVICES)<Device[]>();

export const clearDevices = createAction(CLEAR_DEVICES)();
