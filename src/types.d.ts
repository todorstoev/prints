export interface AuthState {
    isLoggingIn: boolean
    isLoggingOut: boolean
    isVerifying: boolean
    loginError: boolean
    logoutError: boolean
    isAuthenticated: boolean
    user: User
}

export interface RootState {
    auth: AuthState
}

type User = {
    username?: boolean
}
