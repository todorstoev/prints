import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { loginUser, registerUser } from '../actions'
import { RootState } from '../types'
import SignUp from '../components/Signup'

const mapState = (state: RootState) => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        error: state.auth.error,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

const mapDispatch = {
    loginUser,
    registerUser,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const LoginForm: React.FC<any> = ({ error, loginUser }) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleEmailChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setEmail(currentTarget.value)

    const handlePasswordChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setPassword(currentTarget.value)

    const handleSubmit = () => loginUser(email, password)

    return (
        <div className={'login-form'}>
            <h1>Log In</h1>
            <input
                name={'email'}
                className={'email'}
                onChange={handleEmailChange}
            />
            <input
                name={'password'}
                className={'password'}
                type={'password'}
                onChange={handlePasswordChange}
            />
            <button type={'button'} onClick={handleSubmit}>
                Sign In
            </button>
            {error && <div>{error}</div>}
        </div>
    )
}

const Login: React.FC<PropsFromRedux> = ({
    isAuthenticated,
    error,
    loginUser,
    registerUser,
}) => {
    const [isLogin, setIsLogin] = useState<boolean>(true)
    if (isAuthenticated) return <Redirect to="/" />
    return (
        <div>
            {isLogin ? (
                <LoginForm {...{ error, loginUser }} />
            ) : (
                <SignUp {...{ error, registerUser }} />
            )}
            {isLogin ? (
                <button onClick={() => setIsLogin(false)}>Sign Up</button>
            ) : (
                <button onClick={() => setIsLogin(true)}>Log In</button>
            )}
        </div>
    )
}

export default connector(Login)
