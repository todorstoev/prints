import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_CANCEL,
    REGISTER_SUCCESS,
    REGISTER_REQUEST,
    REGISTER_CANCEL,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    VERIFY_REQUEST,
    VERIFY_SUCCESS,
} from '../actions/'

import { AuthState } from '../types'

export default (
    state: AuthState = {
        isLoggingIn: false,
        isLoggingOut: false,
        isVerifying: false,

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
            }

        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
            }
        case LOGIN_CANCEL:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
            }
        case REGISTER_REQUEST:
            return {
                ...state,
                isLoggingIn: true,
            }
        case REGISTER_SUCCESS:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: true,
                user: action.user,
            }
        case REGISTER_CANCEL:
            return {
                ...state,
                isLoggingIn: false,
                isAuthenticated: false,
            }
        case LOGOUT_REQUEST:
            return {
                ...state,
                isLoggingOut: true,
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
