export interface AuthState {
    isLoggingIn: boolean
    isLoggingOut: boolean
    isVerifying: boolean
    isAuthenticated: boolean
    user: PrintsUser
}

export interface RootState {
    auth: AuthState
    errors: ErrorsState
}

export interface PrintsUser {
    firstName: string
    lastName: string
    email: string
    pic: string
    uid: string | undefined
    username: string
    refreshToken?: string
    devices: Device[]
}

export type Coords = {
    lat: number
    lng: number
}

export interface Printer {
    dimensions: {
        width: number
        height: number
        depth: number
    }
    brand: string
    model: string
}

export interface Device extends Printer {
    location: Coords
    materials: string[]
    type: string
    id?: string
}

export type PrintsGenericError = {
    message: string
    code: any
}

export interface ErrorsState {
    devicesError?: PrimnsGenericError
    authError?: PrimnsGenericError
}
