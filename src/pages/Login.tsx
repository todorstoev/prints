import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { loginUser, registerUser } from '../actions'
import { RootState } from '../types'
import SignUp from '../components/Signup'
import { Button, Box, Heading, Text } from 'rebass'
import { Input } from '@rebass/forms'

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
        <Box className={'login-form'} sx={{ margin: 'auto', width: '30%' }}>
            <Heading fontSize={[5, 6, 7]}>Log In</Heading>
            <Input
                name={'email'}
                className={'email'}
                onChange={handleEmailChange}
            />
            <Input
                name={'password'}
                className={'password'}
                type={'password'}
                onChange={handlePasswordChange}
            />

            <Button variant="primary" mr={2} onClick={handleSubmit}>
                Sign In
            </Button>
            {error && <Text>{error}</Text>}
        </Box>
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
        <Box>
            {isLogin ? (
                <LoginForm {...{ error, loginUser }} />
            ) : (
                <SignUp {...{ error, registerUser }} />
            )}
            {isLogin ? (
                <Button
                    variant="outline"
                    mr={2}
                    onClick={() => setIsLogin(false)}
                >
                    Sign Up
                </Button>
            ) : (
                <Button
                    variant="outline"
                    mr={2}
                    onClick={() => setIsLogin(true)}
                >
                    Log In
                </Button>
            )}
        </Box>
    )
}

export default connector(Login)
