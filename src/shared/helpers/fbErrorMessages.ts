import { FirebaseError } from 'firebase'

export const fbErrorMessages = (error: FirebaseError): string => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is allready taken'
        case 'auth/invalid-email':
            return 'Enter valid email'
        case 'auth/wrong-password':
            return 'Wrong password'
        case 'auth/user-not-found':
            return 'No such user'
        case 'auth/popup-closed-by-user':
            return 'Google Login was canceled'
        case 'auth/requires-recent-login':
            return 'Log in again before retrying to change your email.'
        case 'not-found':
            return 'Wrong user'
        default:
            return error.message
    }
}
