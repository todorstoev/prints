import { createReducer } from 'typesafe-actions'
import { RootAction, actions } from '..'
import { ErrorsState } from '../../../types'

const initialState: ErrorsState = { authError: null, devicesError: null }

export const errorReducer = createReducer<ErrorsState, RootAction>(initialState)
    .handleAction(actions.recieveAuthError, (state, action) => ({
        ...state,
        authError: action.payload,
    }))
    .handleAction(actions.recieveDeviceError, (state, action) => ({
        ...state,
        devicesError: action.payload,
    }))
    .handleAction(actions.clearAuthErrors, state => ({
        ...state,
        authError: null,
    }))
