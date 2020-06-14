import {
    SUCCESS_DEVICE_ADD,
    SUCCESS_DEVICE_REMOVE,
    REQUEST_DEVICE_ADD,
    REQUEST_DEVICE_REMOVE,
    DEVICES_FROM_LOGIN,
} from '../actions'

import { DeviceState } from '../types'

export default (
    state: DeviceState = { userDevices: [], allDevices: [], isLoading: false },
    action: any
) => {
    switch (action.type) {
        case REQUEST_DEVICE_ADD:
            return {
                ...state,
                isLoading: true,
            }
        case SUCCESS_DEVICE_ADD:
            return {
                ...state,
                isLoading: false,
                userDevices: [...state.userDevices, action.device],
            }
        case REQUEST_DEVICE_REMOVE:
            return {
                ...state,
                isLoading: true,
            }
        case SUCCESS_DEVICE_REMOVE:
            return {
                ...state,
                isLoading: false,
                userDevices: action.devices,
            }
        case DEVICES_FROM_LOGIN:
            return {
                ...state,
                userDevices: action.devices,
            }
        default:
            return state
    }
}
