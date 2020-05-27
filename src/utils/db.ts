import { Device, Printer, PrintsUser } from '../types'
import { db } from '../firebase/firebase'
import { FirebaseError } from 'firebase'

export const getDevices = (): Promise<Device[]> => {
    return new Promise<Device[]>((resolve, reject) => {
        db.collection('devices').onSnapshot(snapshot => {
            const devices = snapshot.docs.map(doc => doc.data() as Device)

            resolve(devices)
        })
    })
}

export const getUserDevices = (
    userUid: string,
    onDeviceChanged: (currentData: firebase.firestore.DocumentData) => void,
    onError?: () => void,
    onCompletion?: () => void
) => {
    db.collection('devices')
        .where('owner', '==', userUid)
        .onSnapshot(onDeviceChanged, onError, onCompletion)
}

export const getPrinters = (): Promise<Printer[]> => {
    return new Promise<Printer[]>((resolve, reject) => {
        db.collection('printers').onSnapshot(snapshot => {
            const printers = snapshot.docs.map(doc => doc.data() as Printer)

            resolve(printers)
        })
    })
}

export const saveUserToDb = (
    user: PrintsUser
): Promise<boolean | FirebaseError> => {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .add(user)
            .then(_snapshot => {
                resolve(true)
            })
            .catch(e => {
                reject(e)
            })
    })
}

export const getUserFromDb = (uid: string): Promise<any> => {
    return new Promise(resolve => {
        db.collection('users')
            .where('uid', '==', uid)
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    resolve(doc.data())
                })
            })
            .catch(e => {
                throw e
            })
    })
}
