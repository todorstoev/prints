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
    material: string
    type: string
    owner: string
}
