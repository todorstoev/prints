import { myFirebase } from '../firebase/firebase'
import { Dispatch } from 'redux'
import { FirebaseError } from 'firebase'

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

const recieveError = (error: FirebaseError) => {
    return {
        type: ERROR,
        error,
    }
}

export const registerUser = (emal: string, password: string) => (
    dispatch: Dispatch
): void => {
    dispatch(requestRegister())
    myFirebase
        .auth()
        .createUserWithEmailAndPassword(emal, password)
        .then(user => {
            dispatch(recieveRegister(user))
        })
        .catch((e: FirebaseError) => {
            dispatch(recieveError(e))
        })
}

export const loginUser = (email: string, password: string) => (
    dispatch: Dispatch
): void => {
    dispatch(requestLogin())
    myFirebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
            dispatch(receiveLogin(user))
        })
        .catch((e: FirebaseError) => {
            dispatch(recieveError(e))
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
