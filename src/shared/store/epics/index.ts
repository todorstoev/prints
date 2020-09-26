import { combineEpics } from 'redux-observable'
import { registerUserEpic } from './auth'

export * from './auth'
export * from './devices'

export default combineEpics(registerUserEpic)
