import {
    myFirebase,
    googleProvider,
    localPersistance,
    nonePersistance,
} from '../firebase/firebase'
import { Dispatch } from 'redux'
import { FirebaseError, User } from 'firebase'
import { PrintsUser, Device } from '../types'
import {
    remapUser,
    saveUserToDb,
    fbErrorMessages,
    getUserFromDb,
    updateEmail,
    updateUserDB,
} from '../utils'
import { recieveAuthError, clearAuthErrors } from './errors'
import { getDevicesFromLogin } from '.'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_CANCEL = 'LOGIN_CANCEL'

export const REGISTER_REQUEST = 'REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_CANCEL = 'REGISTER_CANCEL'

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST'
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS'

export const VERIFY_REQUEST = 'VERIFY_REQUEST'
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS'

const requestLogin = () => {
    return {
        type: LOGIN_REQUEST,
    }
}

const receiveLogin = (user: PrintsUser) => {
    return {
        type: LOGIN_SUCCESS,
        user,
    }
}

const cancelLogin = () => {
    return {
        type: LOGIN_CANCEL,
    }
}

const requestRegister = () => {
    return {
        type: REGISTER_REQUEST,
    }
}

const recieveRegister = (user: PrintsUser) => {
    return {
        type: REGISTER_SUCCESS,
        user,
    }
}

const cancelRegister = () => {
    return {
        type: REGISTER_CANCEL,
    }
}

const requestLogout = () => {
    return {
        type: LOGOUT_REQUEST,
    }
}

const receiveLogout = () => {
    return {
        type: LOGOUT_SUCCESS,
    }
}

const verifyRequest = () => {
    return {
        type: VERIFY_REQUEST,
    }
}

const verifySuccess = () => {
    return {
        type: VERIFY_SUCCESS,
    }
}

const updateUserRequest = () => {
    return {
        type: UPDATE_USER_REQUEST,
    }
}

const updateUserSuccess = (user: PrintsUser) => {
    return {
        type: UPDATE_USER_SUCCESS,
        user,
    }
}

export const registerUser = (email: string, password: string) => (
    dispatch: Dispatch
): void => {
    dispatch(requestRegister())
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
                    dispatch(clearAuthErrors())
                    if (res)
                        dispatch(
                            recieveRegister({
                                ...userToInsert,
                                refreshToken: (user.user as User).refreshToken,
                            } as PrintsUser)
                        )
                })
                .catch(e => {
                    dispatch(cancelRegister())
                    dispatch(recieveAuthError({ code: 'fbError', message: e }))
                })
        })
        .catch((e: FirebaseError) => {
            const error: string = fbErrorMessages(e)
            dispatch(cancelRegister())
            dispatch(recieveAuthError({ code: 'fbError', message: error }))
        })
}

export const loginGoogle = () => (dispatch: Dispatch) => {
    dispatch(requestLogin())
    myFirebase
        .auth()
        .signInWithPopup(googleProvider)
        .then((user: any) => {
            const userToInsert: PrintsUser = remapUser(user)
            if (user.additionalUserInfo.isNewUser) {
                saveUserToDb({ ...userToInsert, devices: [] })
                    .then(res => {
                        dispatch(clearAuthErrors())
                        if (res)
                            dispatch(
                                receiveLogin({
                                    ...userToInsert,
                                    refreshToken: user.user.refreshToken,
                                } as PrintsUser)
                            )
                    })
                    .catch(e => {
                        dispatch(cancelLogin())
                        dispatch(
                            recieveAuthError({
                                code: 'fbError',
                                message: e,
                            })
                        )
                    })
            } else {
                dispatch(clearAuthErrors())
                dispatch(receiveLogin(userToInsert))
            }
        })
        .catch(e => {
            dispatch(cancelLogin())
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
    dispatch(requestLogin())
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
            dispatch(receiveLogin(userToInsert))
        })
        .catch((e: FirebaseError) => {
            const error = fbErrorMessages(e)
            dispatch(cancelLogin())
            dispatch(recieveAuthError({ code: 'fbError', message: error }))
        })
}

export const logoutUser = () => (dispatch: Dispatch) => {
    dispatch(requestLogout())
    myFirebase
        .auth()
        .signOut()
        .then(() => {
            dispatch(clearAuthErrors())
            dispatch(receiveLogout())
        })
        .catch(e => {
            //Do something with the error if you want!
            dispatch(recieveAuthError({ code: 'fbErrorLogout', message: e }))
        })
}

export const verifyAuth: any = () => (dispatch: Dispatch) => {
    dispatch(verifyRequest())

    myFirebase.auth().onAuthStateChanged(async user => {
        if (user !== null) {
            const userToInsert: PrintsUser = await getUserFromDb(user.uid)

            dispatch(receiveLogin(userToInsert))

            dispatch(getDevicesFromLogin(userToInsert.devices as Device[]))
        }

        dispatch(verifySuccess())
    })
}

export const updateUser = (user: PrintsUser, newData: any) => async (
    dispatch: Dispatch
) => {
    dispatch(updateUserRequest())

    try {
        if (newData.email !== user.email) await updateEmail(newData.email, user)

        user.email = newData.email
        user.firstName = newData.firstName
        user.lastName = newData.lastName
        user.username = newData.username

        await updateUserDB(user)

        dispatch(updateUserSuccess(user))
    } catch (e) {
        throw e
    }
}
