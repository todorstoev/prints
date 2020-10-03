import { combineEpics } from 'redux-observable'
import {
    loginSSOEpic,
    loginUserEpic,
    logoutUserEpic,
    verifyRequestEpic,
    registerUserEpic,
} from './auth'

export * from './auth'
export * from './devices'

// const combinedEpics = [...Object.values(authEpics)]

export const rootEpics = combineEpics(
    loginSSOEpic,
    loginUserEpic,
    logoutUserEpic,
    verifyRequestEpic,
    registerUserEpic
)
