import { FirebaseError } from 'firebase'

export const fbErrorMessages = (error: FirebaseError): string => {
    debugger
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is allready taken'
        case 'auth/invalid-email':
            return 'Enter valid email'

        default:
            return error.message
    }
}
