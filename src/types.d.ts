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
