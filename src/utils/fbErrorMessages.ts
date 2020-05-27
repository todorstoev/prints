import { FirebaseError } from 'firebase'

export const fbErrorMessages = (error: FirebaseError): string => {
    debugger
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is allready taken'
        case 'auth/invalid-email':
            return 'Enter valid email'
        case 'auth/wrong-password':
            return 'Wrong password'
        case 'auth/user-not-found':
            return 'No such user'
        default:
            return error.message
    }
}
