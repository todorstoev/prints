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
    refreshToken: string
    uid: string
    displayName: string
    photoURL: string
    email: string
    emailVerified: boolean
    phoneNumber: string
    isAnonymous: boolean
    tenantId: string
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
    uid: string
}
