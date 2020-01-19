import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { loginUser, registerUser, loginGoogle } from '../actions'
import { RootState } from '../types'
import SignUp from '../components/Signup'
import { Button, Box, Heading, Text, Flex, Link } from 'rebass'
import { Input, Label, Checkbox } from '@rebass/forms'

import { useSpring, animated as a } from 'react-spring'
import { theme } from '../theme'

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
    loginGoogle,
}

const connector = connect(mapState, mapDispatch)

export type PropsFromRedux = ConnectedProps<typeof connector>

const LoginForm: React.FC<any> = ({
    error,
    loginUser,
    setIsLogin,
    loginGoogle,
}) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [remember, setRemember] = useState<boolean>(true)

    const handleEmailChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setEmail(currentTarget.value)

    const handlePasswordChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setPassword(currentTarget.value)

    const handleRememberMe = (e: React.FormEvent<HTMLInputElement>) => {
        setRemember(e.currentTarget.checked)
    }

    const handleSubmit = () => loginUser(email, password, remember)

    return (
        <Flex flexWrap="wrap" flex="1 0 auto" justifyContent={'space-evenly'}>
            <Box
                width={['25%']}
                className={'login-form'}
                margin={'100px  auto'}
                as="form"
                onSubmit={e => e.preventDefault()}
                p={20}
                backgroundColor={'#fff'}
            >
                <Box
                    p={1}
                    sx={{
                        textAlign: 'center',
                        borderRadius: 6,
                        backgroundImage: `linear-gradient(to left, ${theme.colors.text}, ${theme.colors.primary});`,
                    }}
                >
                    <Box
                        p={4}
                        backgroundColor={'#fff'}
                        sx={{ borderRadius: 6 }}
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
                        <Box height={50}>
                            {error && (
                                <Text color="error" mt={2}>
                                    {error}
                                </Text>
                            )}
                        </Box>
                        <Flex>
                            <Box width={1 / 2}>
                                <Label>
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={remember}
                                        onChange={handleRememberMe}
                                    />
                                    Remember me
                                </Label>
                            </Box>
                            <Box width={1 / 2}>
                                <Link href="https://rebassjs.org">
                                    Forget Your Password ?
                                </Link>
                            </Box>
                        </Flex>
                        <Box mt={20} width={[1 / 1]}>
                            <Button
                                variant="secondary"
                                onClick={handleSubmit}
                                width={[1 / 1]}
                            >
                                Log In
                            </Button>
                        </Box>
                        <Box mt={15} width={[1 / 1]}>
                            <Button
                                width={[1 / 1]}
                                // variant="primary"
                                backgroundColor={'#cf4332'}
                                onClick={() => {
                                    loginGoogle()
                                }}
                            >
                                Login with Google
                            </Button>
                        </Box>
                        <Flex flexWrap="wrap" mt={20} justifyContent={'start'}>
                            <Text mr={3}>Dont have account ?</Text>

                            <Link
                                sx={{
                                    ':hover': {
                                        cursor: 'pointer',
                                    },
                                }}
                                onClick={() => {
                                    setIsLogin(false)
                                }}
                            >
                                Register
                            </Link>
                        </Flex>
                    </Box>
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
    loginGoogle,
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
            height={'100%'}
            sx={{
                // backgroundImage: 'linear-gradient(to left, #00f260, #0575e6);',
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
                    <LoginForm
                        {...{ error, loginUser, setIsLogin, loginGoogle }}
                    />
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
