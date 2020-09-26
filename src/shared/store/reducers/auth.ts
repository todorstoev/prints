import { createReducer } from 'typesafe-actions'

import { AuthState } from '../../../types'

import { actions, RootAction } from '..'

const initialState: AuthState = {
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    isLoading: false,
    isAuthenticated: false,
    user: {
        email: '',
        uid: '',
        firstName: '',
        lastName: '',
        pic: '',
        refreshToken: '',
        username: '',
    },
}

export const authReducer = createReducer<AuthState, RootAction>(initialState)
    .handleAction(actions.requestLogin, state => ({
        ...state,
        isLoggingIn: true,
    }))
    .handleAction(actions.receiveLogin, (state, action) => ({
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.payload,
    }))
    .handleAction(actions.cancelLogin, state => ({
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
    }))
    .handleAction(actions.requestRegister, state => ({
        ...state,
        isLoggingIn: true,
    }))
    .handleAction(actions.recieveRegister, (state, action) => ({
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        user: action.payload,
    }))
    .handleAction(actions.cancelRegister, state => ({
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
    }))
    .handleAction(actions.requestLogout, state => ({
        ...state,
        isLoggingOut: true,
    }))
    .handleAction(actions.receiveLogout, state => ({
        ...state,
        isLoggingOut: false,
        isAuthenticated: false,

        user: {
            email: '',
            uid: '',
            firstName: '',
            lastName: '',
            pic: '',
            refreshToken: '',
            username: '',
        },
    }))
    .handleAction(actions.verifyRequest, state => ({
        ...state,
        isVerifying: true,
    }))
    .handleAction(actions.verifySuccess, state => ({
        ...state,
        isVerifying: false,
    }))
    .handleAction(actions.updateUserRequest, state => ({
        ...state,
        isLoading: true,
    }))
    .handleAction(actions.updateUserSuccess, (state, action) => ({
        ...state,
        isLoading: false,
        user: action.payload,
    }))