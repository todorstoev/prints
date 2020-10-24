import { applyMiddleware, createStore } from 'redux'

import { createEpicMiddleware } from 'redux-observable'
import { logger } from 'redux-logger'

import { ActionType } from 'typesafe-actions'

import { RootState } from '../../types'

import * as actions from './actions'

import rootReducer from './reducers'

import * as API from '../services'

import { rootEpics } from './epics'

export type RootAction = ActionType<typeof actions>

const epicMiddleware = createEpicMiddleware<RootAction, RootAction, RootState>({
    dependencies: API,
})

const configureStore = (initialState?: RootState) => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(epicMiddleware, logger)
    )

    epicMiddleware.run(rootEpics)

    if (sessionStorage.getItem('3dreact:sso')) {
        store.dispatch(actions.requestSsoLogin())
        sessionStorage.removeItem('3dreact:sso')
    } else {
        store.dispatch(actions.verifyRequest())
    }

    return store
}

export { actions }

export default configureStore
