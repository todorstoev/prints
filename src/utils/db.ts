import { Device, Printer } from '../types'
import { db } from '../firebase/firebase'

export const getDevices = (): Promise<Device[]> => {
    return new Promise<Device[]>((resolve, reject) => {
        db.collection('devices').onSnapshot(snapshot => {
            const devices = snapshot.docs.map(doc => doc.data() as Device)

            resolve(devices)
        })
    })
}

export const getUserDevices = (userUid: string): Promise<Device[]> => {
    return new Promise<Device[]>((resolve, reject) => {
        db.collection('devices')
            .where('owner', '==', userUid)
            .onSnapshot(snapshot => {
                const devices = snapshot.docs.map(doc => doc.data() as Device)

                resolve(devices)
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