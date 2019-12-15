import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { loginUser } from '../actions'
import { RootState } from '../types'

const mapState = (state: RootState) => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

const mapDispatch = {
    loginUser,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const Login: React.FC<PropsFromRedux> = ({
    isAuthenticated,
    loginError,
    loginUser,
}: PropsFromRedux) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    if (isAuthenticated) return <Redirect to="/" />

    const handleEmailChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setEmail(currentTarget.value)

    const handlePasswordChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setPassword(currentTarget.value)

    const handleSubmit = () => loginUser(email, password)

    return (
        <div className={'login-form'}>
            <div>Login</div>
            <input
                name={'email'}
                className={'email'}
                onChange={handleEmailChange}
            />
            <input
                name={'password'}
                className={'password'}
                onChange={handlePasswordChange}
            />
            <button type={'button'} onClick={handleSubmit}>
                Sign In
            </button>
            {loginError && <div>Incorrect email or password.</div>}
        </div>
    )
}

export default connector(Login)
