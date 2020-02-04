export interface AuthState {
    isLoggingIn: boolean
    isLoggingOut: boolean
    isVerifying: boolean
    error: string | null
    isAuthenticated: boolean
    user: User
}

export interface RootState {
    auth: AuthState
}

type User = {
    username?: boolean
}

export type Cords = {
    lat: number
    lng: number
}

export type Device = {
    location: firebase.firestore.GeoPoint
    dimension: {
        width: string
        height: string
        lenght: string
    }
    brand: string
    material: string
    type: string
}
