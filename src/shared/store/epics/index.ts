import { combineEpics } from 'redux-observable'

import * as authEpics from './auth'

export * from './devices'

const combinedEpics = [...Object.values(authEpics)]

export const rootEpics = combineEpics(...combinedEpics)
