import { ChatData, Device, Printer, PrintsUser } from '../../types'
import { db, myFirebase } from './firebase'
import { FirebaseError } from 'firebase'
import { Observable } from 'rxjs'
import { fbErrorMessages } from '../helpers'

export const registerWithEmail = async (
    email: string,
    password: string
): Promise<PrintsUser> => {
    return new Promise((resolve, reject) => {
        myFirebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                const userToInsert: PrintsUser = {
                    email,
                    firstName: '',
                    lastName: '',
                    uid: '',
                    username: '',
                    pic: './assets/user-unknown-com.svg',
                    devices: [],
                }

                userToInsert.uid = res.user?.uid

                resolve(userToInsert)
            })
            .catch(e => {
                reject(fbErrorMessages(e))
            })
    })
}

export const getDevices = (): Observable<Device[]> => {
    return new Observable<Device[]>(subscriber => {
        db.collection('users').onSnapshot({
            next: snapshot => {
                let devicesList: Device[] = []

                for (let i = 0; snapshot.docs.length > i; i++) {
                    const currUserDevices = snapshot.docs[i].data().devices
                    devicesList = [...devicesList, ...currUserDevices]
                }

                subscriber.next(devicesList)
            },
            error: error => subscriber.error(error.message),
            complete: () => subscriber.complete(),
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
): Promise<PrintsUser | FirebaseError> => {
    return new Promise((resolve, reject) => {
        db.collection('users')
            .add(user)
            .then(_snapshot => {
                resolve(user)
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

export const updateEmail = (email: string): Promise<any> => {
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

export const getUserChats = (user: PrintsUser): Observable<ChatData[]> => {
    const doc = db
        .collection('chats')
        .where('users', 'array-contains', user.email)

    return new Observable(subscriber => {
        doc.onSnapshot({
            next: snapshot =>
                subscriber.next(
                    snapshot.docs.map(doc => doc.data() as ChatData)
                ),
            error: error => subscriber.error(error.message),
            complete: () => subscriber.complete(),
        })
    })
}
