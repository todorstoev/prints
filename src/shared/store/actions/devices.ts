import { createAction } from 'typesafe-actions';

import { Device } from '../../../types';

import {
  DEVICES_FROM_LOGIN,
  REQUEST_DEVICE_ADD,
  REQUEST_DEVICE_REMOVE,
  SUCCESS_DEVICE_ADD,
  SUCCESS_DEVICE_REMOVE,
} from '../constants';

export const requestAddDevice = createAction(REQUEST_DEVICE_ADD)<Device>();

export const successAddDevice = createAction(SUCCESS_DEVICE_ADD)<Device>();

export const requestDeleteDevice = createAction(REQUEST_DEVICE_REMOVE)<number>();

export const successDeleteDevice = createAction(SUCCESS_DEVICE_REMOVE)<Device[]>();

export const getDevicesFromLogin = createAction(DEVICES_FROM_LOGIN)<Device[]>();
