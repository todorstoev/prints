import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSEGINID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREID,
}

export default firebase

export const myFirebase = firebase.initializeApp(firebaseConfig)
export const googleProvider = new firebase.auth.GoogleAuthProvider()

export const localPersistance = firebase.auth.Auth.Persistence.LOCAL
export const nonePersistance = firebase.auth.Auth.Persistence.SESSION

const baseDb = myFirebase.firestore()
export const db = baseDb
