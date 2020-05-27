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
        user: {
            email: '',
            uid: '',
            firstName: '',
            lastName: '',
            pic: '',
            refreshToken: '',
            username: '',
        },
    },
    action: any
) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                error: null,
            }
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
                error: null,
            }
        case ERROR:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
                error: action.error,
            }
        case REGISTER_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
                error: null,
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
                error: null,
            }
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
                error: null,
            }
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isLoggingOut: false,
                isAuthenticated: false,
                error: null,
                user: {},
            }
        case VERIFY_REQUEST:
            return {
                ...state,
                isVerifying: true,
                error: null,
            }
        case VERIFY_SUCCESS:
            return {
                ...state,
                isVerifying: false,
                error: null,
            }
        default:
            return state
    }
}
