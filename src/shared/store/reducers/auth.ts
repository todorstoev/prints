import { createReducer } from 'typesafe-actions';

import { AuthState } from '../../../types';

import { actions, RootAction } from '..';

const initialState: AuthState = {
  isLoggingIn: false,
  isLoggingOut: false,
  isVerifying: false,
  isLoading: false,
  isAuthenticated: false,
  user: {
    email: '',
    uid: '',
    photoURL: '',
    refreshToken: '',
    displayName: '',
  },
};

export const authReducer = createReducer<AuthState, RootAction>(initialState)
  .handleAction(actions.requestSsoLogin, (state) => ({
    ...state,
    isLoggingIn: true,
  }))
  .handleAction(actions.recieveSsoLogin, (state, action) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: true,
    user: action.payload,
  }))
  .handleAction(actions.requestLogin, (state) => ({
    ...state,
    isLoggingIn: true,
  }))
  .handleAction(actions.receiveLogin, (state, action) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: true,
    user: action.payload,
  }))
  .handleAction(actions.cancelLogin, (state) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: false,
  }))
  .handleAction(actions.requestRegister, (state) => ({
    ...state,
    isLoggingIn: true,
  }))
  .handleAction(actions.recieveRegister, (state, action) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: true,
    user: action.payload,
  }))
  .handleAction(actions.cancelRegister, (state) => ({
    ...state,
    isLoggingIn: false,
    isAuthenticated: false,
  }))
  .handleAction(actions.requestLogout, (state) => ({
    ...state,
    isLoggingOut: true,
  }))
  .handleAction(actions.receiveLogout, (state) => ({
    ...state,
    isLoggingOut: false,
    isAuthenticated: false,

    user: {
      email: '',
      uid: '',
      photoURL: '',
      refreshToken: '',
      displayName: '',
    },
  }))
  .handleAction(actions.verifyUserRequest, (state) => ({
    ...state,
    isVerifying: true,
  }))
  .handleAction(actions.verifyUserSuccess, (state, action) => ({
    ...state,
    isVerifying: false,
    isAuthenticated: true,
    user: action.payload,
  }))
  .handleAction(actions.verifyUserCancel, (state, action) => ({
    ...state,
    isVerifying: false,
    isAuthenticated: false,
    user: {
      email: '',
      uid: '',
      photoURL: '',
      refreshToken: '',
      displayName: '',
    },
  }))
  .handleAction(actions.updateUserRequest, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(actions.updateUserSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    user: action.payload,
  }))
  .handleAction(actions.deleteUserRequest, (state) => ({
    ...state,
    isLoading: true,
  }))
  .handleAction(actions.deleteUserSuccess, (state) => ({
    ...state,
    isLoading: false,
    isAuthenticated: false,
    user: {
      email: '',
      uid: '',
      photoURL: '',
      refreshToken: '',
      displayName: '',
    },
  }));
