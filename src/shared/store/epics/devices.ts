import { Device, PrintsUser } from '../../../types'
import { Dispatch } from 'redux'
import { updateUserDB } from '../../services'

import { actions } from '..'

export const addDevice: any = (
    device: Device,
    user: PrintsUser
): ((dispatch: Dispatch) => Promise<boolean>) => (dispatch: Dispatch) => {
    return new Promise(resolve => {
        dispatch(actions.requestAddDevice())

        const userWithDevice: PrintsUser = {
            ...user,
            devices: [...(user.devices as Device[]), device],
        }

        updateUserDB(userWithDevice)
            .then(res => {
                if (res) {
                    dispatch(actions.successAddDevice(device))
                    resolve(true)
                }
            })
            .catch(e => {
                dispatch(actions.recieveDeviceError(e))
            })
    })
}

export const removeDevice = (
    deviceIndex: number,
    userDevices: Device[],
    user: PrintsUser
): ((dispatch: Dispatch) => void) => (dispatch: Dispatch): void => {
    dispatch(actions.requestDeleteDevice())

    userDevices.splice(deviceIndex, 1)

    user.devices = userDevices

    updateUserDB(user)
        .then(res => {
            if (res) dispatch(actions.successDeleteDevice(userDevices))
        })
        .catch(e => {
            dispatch(actions.recieveDeviceError(e))
        })
}
