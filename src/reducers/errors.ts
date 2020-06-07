import { AUTH_ERROR, CLEAR_AUTH_ERRORS } from '../actions'

import { ErrorsState } from '../types'

export default (state: ErrorsState = {}, action: any) => {
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
        default:
            return state
    }
}
