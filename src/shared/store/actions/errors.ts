import { createAction } from 'typesafe-actions';
import { PrintsGenericError } from '../../../types';
import { AUTH_ERROR, CLEAR_AUTH_ERRORS, DEVICE_ERROR } from '../constants';

export const recieveAuthError = createAction(AUTH_ERROR)<PrintsGenericError>();

export const recieveDeviceError = createAction(DEVICE_ERROR)<PrintsGenericError>();

export const clearAuthErrors = createAction(CLEAR_AUTH_ERRORS)();
