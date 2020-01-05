import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { loginUser, registerUser } from '../actions'
import { RootState } from '../types'
import SignUp from '../components/Signup'
import { Button, Box, Heading, Text, Flex } from 'rebass'
import { Input, Label } from '@rebass/forms'

import { useSpring, animated as a } from 'react-spring'

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

export type PropsFromRedux = ConnectedProps<typeof connector>

const LoginForm: React.FC<any> = ({ error, loginUser, setIsLogin }) => {
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
        <Flex flexWrap="wrap" flex="1 0 auto" justifyContent={'space-evenly'}>
            <Box
                sx={{ borderRadius: 5 }}
                width={[1 / 2, 1 / 2, 1 / 3, 1 / 5]}
                className={'login-form'}
                margin={'10% auto'}
                as="form"
                onSubmit={e => e.preventDefault()}
                p={20}
                backgroundColor={'#fff'}
            >
                <Heading fontSize={[5, 6, 7]}>Log In</Heading>
                <Label htmlFor="email">Email</Label>

                <Input
                    autoComplete={'on'}
                    name={'email'}
                    className={'email'}
                    mt={2}
                    onChange={handleEmailChange}
                />
                <Label htmlFor="password">Password</Label>
                <Input
                    autoComplete={'on'}
                    name={'password'}
                    className={'password'}
                    type={'password'}
                    mb={2}
                    onChange={handlePasswordChange}
                />
                <Box height={25}>
                    {error && (
                        <Text color="error" mt={2}>
                            {error}
                        </Text>
                    )}
                </Box>
                <Box mt={20}>
                    <Button variant="primary" mr={2} onClick={handleSubmit}>
                        Sign In
                    </Button>
                    <Button
                        variant="secondary"
                        mr={2}
                        onClick={() => {
                            setIsLogin(false)
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Flex>
    )
}

const Login: React.FC<PropsFromRedux> = ({
    isAuthenticated,
    error,
    loginUser,
    registerUser,
}) => {
    const [isLogin, setIsLogin] = useState<boolean>(true)

    const { transform, opacity } = useSpring({
        opacity: !isLogin ? 1 : 0,
        transform: `perspective(600px) rotateX(${!isLogin ? 180 : 0}deg)`,
        config: { mass: 5, tension: 500, friction: 80 },
    })

    if (isAuthenticated) return <Redirect to="/" />
    return (
        <Box
            height={'100vh'}
            sx={{
                backgroundImage: 'linear-gradient(to left, #00f260, #0575e6);',
                overflow: 'hidden',
            }}
        >
            {isLogin ? (
                <a.div
                    style={{
                        opacity: opacity.interpolate((o: any) => 1 - o),
                        transform,
                    }}
                >
                    <LoginForm {...{ error, loginUser, setIsLogin }} />
                </a.div>
            ) : (
                <a.div
                    style={{
                        opacity,
                        transform: transform.interpolate(
                            t => `${t} rotateX(180deg)`
                        ),
                    }}
                >
                    <SignUp {...{ error, registerUser, setIsLogin }} />
                </a.div>
            )}
        </Box>
    )
}

export default connector(Login)
