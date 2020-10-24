import { createAction } from 'typesafe-actions'
import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants'

export const addNotification = createAction(ADD_NOTIFICATION)<string>()

export const removeNotification = createAction(REMOVE_NOTIFICATION)<number>()
