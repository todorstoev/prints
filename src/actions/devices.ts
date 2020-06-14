import { Device, PrintsUser } from '../types'
import { Dispatch } from 'redux'
import { updateUser } from '../utils'
import { recieveDeviceError } from './errors'

export const REQUEST_DEVICE_ADD = 'REQUEST_DEVICE_ADD'
export const SUCCESS_DEVICE_ADD = 'SUCCESS_DEVICE_ADD'

export const REQUEST_DEVICE_REMOVE = 'REQUEST_DEVICE_REMOVE'
export const SUCCESS_DEVICE_REMOVE = 'SUCCESS_DEVICE_REMOVE'

export const DEVICES_FROM_LOGIN = 'DEVICES_FROM_LOGIN'

export const requestAddDevice = () => {
    return {
        type: REQUEST_DEVICE_ADD,
    }
}

export const successAddDevice = (device: Device) => {
    return {
        type: SUCCESS_DEVICE_ADD,
        device,
    }
}

export const requestDeleteDevice = () => {
    return {
        type: REQUEST_DEVICE_REMOVE,
    }
}

export const successDeleteDevice = (devices: Device[]) => {
    return {
        type: SUCCESS_DEVICE_REMOVE,
        devices,
    }
}

export const getDevicesFromLogin = (devices: Device[]) => {
    return {
        type: DEVICES_FROM_LOGIN,
        devices,
    }
}

export const addDevice: any = (
    device: Device,
    user: PrintsUser
): ((dispatch: Dispatch) => Promise<boolean>) => (dispatch: Dispatch) => {
    return new Promise(resolve => {
        dispatch(requestAddDevice())

        const userWithDevice: PrintsUser = {
            ...user,
            devices: [...(user.devices as Device[]), device],
        }

        updateUser(userWithDevice)
            .then(res => {
                if (res) {
                    dispatch(successAddDevice(device))
                    resolve(true)
                }
            })
            .catch(e => {
                dispatch(recieveDeviceError(e))
            })
    })
}

export const removeDevice = (
    deviceIndex: number,
    userDevices: Device[],
    user: PrintsUser
): ((dispatch: Dispatch) => void) => (dispatch: Dispatch): void => {
    dispatch(requestDeleteDevice())

    userDevices.splice(deviceIndex, 1)

    user.devices = userDevices

    updateUser(user)
        .then(res => {
            if (res) dispatch(successDeleteDevice(userDevices))
        })
        .catch(e => {
            dispatch(recieveDeviceError(e))
        })

    console.log(user)
}
