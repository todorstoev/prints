import { PrintsGenericError } from '../types'

export const AUTH_ERROR = 'LOGIN_ERROR'
export const CLEAR_AUTH_ERRORS = 'CLEAR_AUTH_ERRORS'
export const DEVICE_ERROR = 'DEVICE_ERROR'

export const recieveAuthError = (error: PrintsGenericError) => {
    return {
        type: AUTH_ERROR,
        error,
    }
}

export const recieveDeviceError = (error: PrintsGenericError) => {
    return {
        type: DEVICE_ERROR,
        error,
    }
}

export const clearAuthErrors = () => {
    return {
        type: CLEAR_AUTH_ERRORS,
        error: null,
    }
}
