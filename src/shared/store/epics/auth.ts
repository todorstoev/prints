import {
    myFirebase,
    googleProvider,
    localPersistance,
    nonePersistance,
} from '../../services/firebase'

import { Dispatch } from 'redux'

import { FirebaseError, User } from 'firebase'

import { Device, PrintsUser, RootState } from '../../../types'

import { remapUser, fbErrorMessages } from '../../helpers'

import * as API from '../../services'

import {
    getUserFromDb,
    saveUserToDb,
    updateEmail,
    updateUserDB,
} from '../../services'

import {
    recieveAuthError,
    clearAuthErrors,
    getDevicesFromLogin,
} from '../actions'

import { actions, RootAction } from '..'
import { from, of } from 'rxjs'
import { catchError, filter, mergeMap } from 'rxjs/operators'
import { Epic } from 'redux-observable'
import { isActionOf } from 'typesafe-actions'

export const loginGoogle = () => (dispatch: Dispatch) => {
    dispatch(actions.requestLogin())
    myFirebase
        .auth()
        .signInWithPopup(googleProvider)
        .then((user: any) => {
            const userToInsert: PrintsUser = remapUser(user)
            if (user.additionalUserInfo.isNewUser) {
                saveUserToDb({ ...userToInsert, devices: [] })
                    .then(res => {
                        dispatch(actions.clearAuthErrors())
                        if (res)
                            dispatch(
                                actions.receiveLogin({
                                    ...userToInsert,
                                    refreshToken: user.user.refreshToken,
                                } as PrintsUser)
                            )
                    })
                    .catch(e => {
                        dispatch(actions.cancelLogin())
                        dispatch(
                            recieveAuthError({
                                code: 'fbError',
                                message: e,
                            })
                        )
                    })
            } else {
                dispatch(clearAuthErrors())
                dispatch(actions.receiveLogin(userToInsert))
            }
        })
        .catch(e => {
            dispatch(actions.cancelLogin())
            dispatch(
                recieveAuthError({
                    code: 'fbError',
                    message: fbErrorMessages(e),
                })
            )
        })
}

export const loginUser = (
    email: string,
    password: string,
    remember: boolean
) => (dispatch: Dispatch): void => {
    dispatch(actions.requestLogin())
    myFirebase
        .auth()
        .setPersistence(remember ? localPersistance : nonePersistance)
        .then(() =>
            myFirebase.auth().signInWithEmailAndPassword(email, password)
        )
        .then(async user => {
            const uid = (user.user as User).uid

            const userToInsert = await getUserFromDb(uid)
            dispatch(clearAuthErrors())
            dispatch(actions.receiveLogin(userToInsert))
        })
        .catch((e: FirebaseError) => {
            const error = fbErrorMessages(e)
            dispatch(actions.cancelLogin())
            dispatch(recieveAuthError({ code: 'fbError', message: error }))
        })
}

export const logoutUser = () => (dispatch: Dispatch) => {
    dispatch(actions.requestLogout())
    myFirebase
        .auth()
        .signOut()
        .then(() => {
            dispatch(clearAuthErrors())
            dispatch(actions.receiveLogout())
        })
        .catch(e => {
            //Do something with the error if you want!
            dispatch(recieveAuthError({ code: 'fbErrorLogout', message: e }))
        })
}

export const verifyAuth: any = () => (dispatch: Dispatch) => {
    dispatch(actions.verifyRequest())

    myFirebase.auth().onAuthStateChanged(async user => {
        if (user !== null) {
            const userToInsert: PrintsUser = await getUserFromDb(user.uid)

            dispatch(actions.receiveLogin(userToInsert))

            dispatch(getDevicesFromLogin(userToInsert.devices as Device[]))
        }

        dispatch(actions.verifySuccess())
    })
}

export const updateUser = (user: PrintsUser, newData: any) => async (
    dispatch: Dispatch
) => {
    dispatch(actions.updateUserRequest())

    try {
        if (newData.email !== user.email) await updateEmail(newData.email)

        user.email = newData.email
        user.firstName = newData.firstName
        user.lastName = newData.lastName
        user.username = newData.username

        await updateUserDB(user)

        dispatch(actions.updateUserSuccess(user))
    } catch (e) {
        throw e
    }
}

export const registerUserEpic: Epic<
    RootAction,
    RootAction,
    RootState,
    typeof API
> = (action$, _state$, { registerWithEmail, saveUserToDb }) =>
    action$.pipe(
        filter(isActionOf(actions.requestRegister)),

        mergeMap(action => {
            const { email, password } = action.payload

            return from(registerWithEmail(email, password)).pipe(
                mergeMap(user => {
                    return from(saveUserToDb(user)).pipe(
                        mergeMap(res => {
                            return of(
                                actions.recieveRegister(res as PrintsUser),
                                actions.clearAuthErrors()
                            )
                        })
                    )
                }),
                catchError((error: string) => {
                    return of(
                        actions.recieveAuthError({
                            code: 'FbError',
                            message: error,
                        }),
                        actions.cancelRegister()
                    )
                })
            )
        })
    )
