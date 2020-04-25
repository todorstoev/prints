import {
    myFirebase,
    googleProvider,
    localPersistance,
    nonePersistance,
} from '../firebase/firebase'
import { Dispatch } from 'redux'
import { FirebaseError, User } from 'firebase'
import { PrintsUser } from '../types'
import { remapUser, saveUserToDb, fbErrorMessages } from '../utils'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'

export const REGISTER_REQUEST = 'REGISTER_REQUEST'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const ERROR = 'ERROR'

export const VERIFY_REQUEST = 'VERIFY_REQUEST'
export const VERIFY_SUCCESS = 'VERIFY_SUCCESS'

const requestLogin = () => {
    return {
        type: LOGIN_REQUEST,
    }
}

const receiveLogin = (user: any) => {
    return {
        type: LOGIN_SUCCESS,
        user,
    }
}

const requestRegister = () => {
    return {
        type: REGISTER_REQUEST,
    }
}

const recieveRegister = (user: any) => {
    return {
        type: REGISTER_SUCCESS,
        user,
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

const recieveError = (error: string) => {
    return {
        type: ERROR,
        error,
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
            }
            saveUserToDb(userToInsert)
                .then(res => {
                    if (res)
                        dispatch(
                            recieveRegister({
                                ...userToInsert,
                                refreshToken: (user.user as User).refreshToken,
                            } as PrintsUser)
                        )
                })
                .catch(e => {
                    dispatch(recieveError(e))
                })
        })
        .catch((e: FirebaseError) => {
            const error: string = fbErrorMessages(e)

            dispatch(recieveError(error))
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
                saveUserToDb(userToInsert)
                    .then(res => {
                        if (res)
                            dispatch(
                                receiveLogin({
                                    ...userToInsert,
                                    refreshToken: user.user.refreshToken,
                                } as PrintsUser)
                            )
                    })
                    .catch(e => {
                        dispatch(recieveError(e))
                    })
            } else {
                dispatch(receiveLogin(userToInsert))
            }
        })
        .catch(e => {
            dispatch(recieveError(e))
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
        .then(user => {
            dispatch(receiveLogin(user))
        })
        .catch((e: FirebaseError) => {
            const error = fbErrorMessages(e)

            dispatch(recieveError(error))
        })
}

export const logoutUser = () => (dispatch: Dispatch) => {
    dispatch(requestLogout())
    myFirebase
        .auth()
        .signOut()
        .then(() => {
            dispatch(receiveLogout())
        })
        .catch(e => {
            //Do something with the error if you want!
            dispatch(recieveError(e))
        })
}

export const verifyAuth: any = () => (dispatch: Dispatch) => {
    dispatch(verifyRequest())

    myFirebase.auth().onAuthStateChanged(user => {
        if (user !== null) {
            dispatch(receiveLogin(user))
        }
        dispatch(verifySuccess())
    })
}

export const clearAuthErrors = () => (dispatch: Dispatch) => {
    dispatch({
        type: ERROR,
        error: null,
    })
}
