import { applyMiddleware, createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger } from 'redux-logger'

import { verifyAuth } from './actions/'
import rootReducer from './reducers'

const configureStore = (persistedState?: any) => {
    const store = createStore(
        rootReducer,
        persistedState,
        applyMiddleware(thunkMiddleware, logger)
    )

    store.dispatch(verifyAuth())
    return store
}

export default configureStore
