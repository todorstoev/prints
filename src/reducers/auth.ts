import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_REQUEST,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    VERIFY_REQUEST,
    VERIFY_SUCCESS,
    ERROR,
} from '../actions/'

import { AuthState } from '../types'

export default (
    state: AuthState = {
        isLoggingIn: false,
        isLoggingOut: false,
        isVerifying: false,
        error: null,
        isAuthenticated: false,
        user: {},
    },
    action: any
) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                loginError: false,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
            }
        case ERROR:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
                loginError: true,
                error: action.error.message,
            }
        case REGISTER_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                loginError: false,
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
            }
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
                logoutError: false,
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggingOut: false,
                isAuthenticated: false,
                user: {},
            }
        case VERIFY_REQUEST:
            return {
                ...state,
                isVerifying: true,
                verifyingError: false,
            }
        case VERIFY_SUCCESS:
            return {
                ...state,
                isVerifying: false,
            }
        default:
            return state
    }
}
