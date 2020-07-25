import { Device, Printer, PrintsUser } from '../types'
import { db, myFirebase } from '../firebase/firebase'
import { FirebaseError } from 'firebase'

export const getDevices = (): Promise<Device[]> => {
    return new Promise<Device[]>((resolve, reject) => {
        let devicesList: Device[] = []

        db.collection('users').onSnapshot(snapshot => {
            for (let i = 0; snapshot.docs.length > i; i++) {
                const currUserDevices = snapshot.docs[i].data().devices
                devicesList = [...devicesList, ...currUserDevices]
            }

            resolve(devicesList)
        })
    })
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

export const updateUserDB = (user: PrintsUser): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .where('uid', '==', user.uid)
            .get()
            .then(docs => {
                const [doc] = docs.docs
                return doc.ref.update(user)
            })
            .then(() => {
                resolve(true)
            })
            .catch(e => {
                reject(e)
            })
    })
}

export const updateEmail = (email: string, user: PrintsUser): Promise<any> => {
    return new Promise((resolve, reject) => {
        myFirebase
            .auth()
            .currentUser?.updateEmail(email)
            .then(res => {
                resolve(res)
            })
            .catch(e => {
                reject(e)
            })
    })
}
