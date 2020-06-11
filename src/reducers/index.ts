import { combineReducers } from 'redux'
import auth from './auth'
import errors from './errors'
import devices from './devices'

export default combineReducers({ auth, errors, devices })
