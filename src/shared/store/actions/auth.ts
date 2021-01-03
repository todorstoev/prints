import { createAction } from 'typesafe-actions';

import { PrintsUser } from '../../../types';

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_CANCEL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_CANCEL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  VERIFY_USER_REQUEST,
  VERIFY_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  SSO_LOGIN_REQUEST,
  SSO_LOGIN_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  VERIFY_USER_CANCEL,
  SET_COOKIE_CONSENT,
} from '../constants';

export const requestLogin = createAction(LOGIN_REQUEST)<{
  email: string;
  password: string;
  remember: boolean;
}>();

export const receiveLogin = createAction(LOGIN_SUCCESS)<PrintsUser>();

export const cancelLogin = createAction(LOGIN_CANCEL)();

export const requestSsoLogin = createAction(SSO_LOGIN_REQUEST)();

export const recieveSsoLogin = createAction(SSO_LOGIN_SUCCESS)<PrintsUser>();

export const requestRegister = createAction(REGISTER_REQUEST)<{
  email: string;
  password: string;
}>();

export const recieveRegister = createAction(REGISTER_SUCCESS)<PrintsUser>();

export const cancelRegister = createAction(REGISTER_CANCEL)();

export const requestLogout = createAction(LOGOUT_REQUEST)();

export const receiveLogout = createAction(LOGOUT_SUCCESS)();

export const verifyUserRequest = createAction(VERIFY_USER_REQUEST)();

export const verifyUserSuccess = createAction(VERIFY_USER_SUCCESS)<PrintsUser>();

export const verifyUserCancel = createAction(VERIFY_USER_CANCEL)();

export const updateUserRequest = createAction(UPDATE_USER_REQUEST)<{
  data: any;
}>();

export const updateUserSuccess = createAction(UPDATE_USER_SUCCESS)<PrintsUser>();

export const deleteUserRequest = createAction(DELETE_USER_REQUEST)();

export const deleteUserSuccess = createAction(DELETE_USER_SUCCESS)();

export const setCookieConsent = createAction(SET_COOKIE_CONSENT)<boolean>();
