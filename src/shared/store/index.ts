import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger } from 'redux-logger'

import { ActionType } from 'typesafe-actions'

import * as actions from './actions'

import rootReducer from './reducers'

import { RootState } from '../../types'
import { verifyAuth } from './epics'

export type RootAction = ActionType<typeof actions>

const configureStore = (initialState?: RootState) => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunkMiddleware, logger)
    )

    store.dispatch(verifyAuth())
    return store
}

export { actions }

export default configureStore
