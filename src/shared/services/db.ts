import { ChatData, Device, Printer, PrintsUser } from '../../types'
import {
    db,
    googleProvider,
    myFirebase,
    localPersistance,
    nonePersistance,
} from './firebase'
import { FirebaseError, User } from 'firebase'
import { Observable } from 'rxjs'
import { fbErrorMessages, remapUser } from '../helpers'

export const registerWithEmail = async (
    email: string,
    password: string
): Promise<PrintsUser> => {
    return new Promise((resolve, reject) => {
        const userToInsert: PrintsUser = {
            email,
            firstName: '',
            lastName: '',
            uid: '',
            username: '',
            pic: './assets/user-unknown-com.svg',
            devices: [],
        }

        myFirebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(res => {
                userToInsert.uid = res.user?.uid

                return saveUserToDb(userToInsert)
            })
            .then(res => {
                if (res) resolve(userToInsert)
            })
            .catch(e => reject(fbErrorMessages(e)))
    })
}

export const loginWithGoogleStart = (): boolean => {
    sessionStorage.setItem('3dreact:sso', 'logging')
    myFirebase.auth().signInWithRedirect(googleProvider)

    return true
}

export const loginWithSsoFinish = (): Promise<PrintsUser> => {
    return new Promise((resolve, reject) => {
        myFirebase
            .auth()
            .getRedirectResult()
            .then(res => {
                const userToInsert = remapUser(res)

                if (res.additionalUserInfo?.isNewUser) {
                    saveUserToDb(userToInsert)
                        .then(() => resolve(userToInsert))
                        .catch(e => reject(fbErrorMessages(e)))
                } else {
                    resolve(userToInsert)
                }
            })
            .catch(e => reject(fbErrorMessages(e)))
    })
}

export const loginWithEmail = (
    email: string,
    password: string,
    remember: boolean
): Promise<PrintsUser> => {
    return new Promise((resolve, reject) => {
        myFirebase
            .auth()
            .setPersistence(remember ? localPersistance : nonePersistance)
            .then(() =>
                myFirebase.auth().signInWithEmailAndPassword(email, password)
            )
            .then(res => {
                const uid = (res.user as User).uid

                return getUserFromDb(uid)
            })
            .then(res => {
                resolve(res)
            })
            .catch(e => reject(fbErrorMessages(e)))
    })
}

export const getCurrentUser = (): Promise<firebase.User> => {
    return new Promise((resolve, reject) => {
        var user = myFirebase.auth().currentUser

        if (user) {
            resolve(user)
        } else {
            reject(null)
        }
    })
}

export const logoutUser = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        myFirebase
            .auth()
            .signOut()
            .then(() => {
                resolve(true)
            })
            .catch(e => reject(fbErrorMessages(e)))
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

export const updateUser = (
    user: PrintsUser,
    newData: any
): Promise<PrintsUser> => {
    return new Promise((resolve, reject) => {
        if (newData.email === user.email) reject(null)

        updateEmail(newData.email)
            .then(() => {
                user.email = newData.email
                user.firstName = newData.firstName
                user.lastName = newData.lastName
                user.username = newData.username

                return updateUserDB(user)
            })
            .then(() => resolve(user))
            .catch(e => reject(fbErrorMessages(e)))
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
