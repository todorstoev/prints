import { Device, PrintsUser } from '../types'
import { Dispatch } from 'redux'
import { updateUser } from '../utils'

export const REQUEST_DEVICE_ADD = 'REQUEST_DEVICE_ADD'
export const SUCCESS_DEVICE_ADD = 'SUCCESS_DEVICE_ADD'

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

export const addDevice: any = (device: Device, user: PrintsUser) => (
    dispatch: Dispatch
) => {
    dispatch(requestAddDevice())

    const userWithDevice: PrintsUser = {
        ...user,
        devices: [...user.devices, device],
    }

    updateUser(userWithDevice)
        .then(res => {
            if (res) dispatch(successAddDevice(device))
        })
        .catch(e => {
            //TODO: handle errors
            debugger
        })
}
