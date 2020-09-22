import { combineReducers } from 'redux'
import { authReducer } from './auth'
import { errorReducer } from './errors'
import { deviceReducer } from './devices'

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    devices: deviceReducer,
})
