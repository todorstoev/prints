import { PrintsGenericError } from '../types'
import { Dispatch } from 'redux'

export const AUTH_ERROR = 'LOGIN_ERROR'
export const CLEAR_AUTH_ERRORS = 'CLEAR_AUTH_ERRORS'

export const recieveLoginError = (error: PrintsGenericError) => {
    return {
        type: AUTH_ERROR,
        error,
    }
}

export const clearAuthErrors = () => (dispatch: Dispatch) => {
    dispatch({
        type: CLEAR_AUTH_ERRORS,
        error: null,
    })
}
