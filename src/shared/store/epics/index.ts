import { combineEpics } from 'redux-observable'
import {
    registerUserEpic,
    loginSSOEpic,
    loginUserEpic,
    logoutUserEpic,
} from './auth'

export * from './auth'
export * from './devices'

export default combineEpics(
    registerUserEpic,
    loginSSOEpic,
    loginUserEpic,
    logoutUserEpic
)
