import { Device, PrintsUser } from '../types'
import { Dispatch } from 'redux'
import { updateUser } from '../utils'
import { recieveDeviceError } from './errors'
import { useReducer } from 'react'

export const REQUEST_DEVICE_ADD = 'REQUEST_DEVICE_ADD'
export const SUCCESS_DEVICE_ADD = 'SUCCESS_DEVICE_ADD'
export const REQUEST_DEVICE_REMOVE = 'REQUEST_DEVICE_REMOVE'
export const SUCCESS_DEVICE_REMOVE = 'SUCCESS_DEVICE_REMOVE'

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

export const successDeleteDevice = (user: PrintsUser) => {
    return {
        type: SUCCESS_DEVICE_REMOVE,
        user,
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

// export const removeDevice = (
//     deviceIndex: number,
//     user: PrintsUser
// ): ((dispatch: Dispatch) => void) => (dispatch: Dispatch): void => {
//     dispatch(requestDeleteDevice())

//     user.devices.splice(deviceIndex, 1)

//     updateUser(user)
//         .then(res => {
//             if (res) dispatch(successDeleteDevice(user))
//         })
//         .catch(e => {
//             dispatch(recieveDeviceError(e))
//         })

//     console.log(user)
// }
