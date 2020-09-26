import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createEpicMiddleware } from 'redux-observable'
import { logger } from 'redux-logger'

import { ActionType } from 'typesafe-actions'

import { RootState } from '../../types'

import * as actions from './actions'

import rootReducer from './reducers'

import * as API from '../services'

import Epics, { verifyAuth } from './epics'

export type RootAction = ActionType<typeof actions>

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>({
    dependencies: API,
})

const configureStore = (initialState?: RootState) => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(epicMiddleware, thunkMiddleware, logger)
    )

    epicMiddleware.run(Epics)

    store.dispatch(verifyAuth())

    return store
}

export { actions }

export default configureStore
