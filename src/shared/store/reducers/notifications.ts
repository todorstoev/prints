import { action, createReducer } from 'typesafe-actions'
import { RootAction, actions } from '..'

import { NotificationState } from '../../../types'

const initialState: NotificationState = { items: [] }

let id: number = 0

export const notificationsReducer = createReducer<
    NotificationState,
    RootAction
>(initialState)
    .handleAction(actions.addNotification, (state, action) => {
        return {
            ...state,
            items: [...state.items, { msg: action.payload, key: id++ }],
        }
    })
    .handleAction(actions.removeNotification, (state, action) => {
        const newItems = state.items.filter(i => i.key !== action.payload)
        return {
            ...state,
            items: [],
        }
    })
