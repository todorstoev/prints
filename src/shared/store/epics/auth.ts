import {
    myFirebase,
    googleProvider,
    localPersistance,
    nonePersistance,
} from '../../../firebase/firebase'

import { Dispatch } from 'redux'

import { FirebaseError, User } from 'firebase'

import { Device, PrintsUser } from '../../../types'

import { remapUser, fbErrorMessages } from '../../helpers'

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

import { actions } from '..'

export const registerUser = (email: string, password: string) => (
    dispatch: Dispatch
): void => {
    dispatch(actions.requestRegister())
    myFirebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
            const userToInsert: PrintsUser = {
                email,
                firstName: '',
                lastName: '',
                uid: (user.user as User).uid,
                username: '',
                pic: './assets/user-unknown-com.svg',
                devices: [],
            }
            saveUserToDb(userToInsert)
                .then(res => {
                    dispatch(actions.clearAuthErrors())
                    if (res)
                        dispatch(
                            actions.recieveRegister({
                                ...userToInsert,
                                refreshToken: (user.user as User).refreshToken,
                            } as PrintsUser)
                        )
                })
                .catch(e => {
                    dispatch(actions.cancelRegister())
                    dispatch(recieveAuthError({ code: 'fbError', message: e }))
                })
        })
        .catch((e: FirebaseError) => {
            const error: string = fbErrorMessages(e)
            dispatch(actions.cancelRegister())
            dispatch(recieveAuthError({ code: 'fbError', message: error }))
        })
}

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
