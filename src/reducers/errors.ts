import { AUTH_ERROR, CLEAR_AUTH_ERRORS, DEVICE_ERROR } from '../actions'

import { ErrorsState } from '../types'

export default (
    state: ErrorsState = { authError: null, devicesError: null },
    action: any
) => {
    switch (action.type) {
        case AUTH_ERROR:
            return {
                ...state,
                authError: action.error,
            } as ErrorsState
        case CLEAR_AUTH_ERRORS:
            return {
                ...state,
                authError: null,
            }
        case DEVICE_ERROR:
            return {
                ...state,
                devicesError: action.error,
            } as ErrorsState
        default:
            return state
    }
}
