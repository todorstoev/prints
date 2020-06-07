import React, { useState } from 'react'
import { Button, Box, Heading, Text, Flex, Link } from 'rebass'
import { Input, Label, Checkbox } from '@rebass/forms'

import { connect, ConnectedProps } from 'react-redux'

import { loginUser, loginGoogle, clearAuthErrors } from '../actions'

import { RootState } from '../types'
import { Loader } from './Loader'

const mapState = (state: RootState) => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        error: state.errors.authError,
    }
}

const mapDispatch = {
    loginUser,
    loginGoogle,
    clearAuthErrors,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    setIsLogin: (login: boolean) => void
}

const SignIn: React.FC<Props> = ({
    error,
    loginUser,
    setIsLogin,
    loginGoogle,
    clearAuthErrors,
    isLoggingIn,
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
        <React.Fragment>
            {isLoggingIn && (
                <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    height={'100vh'}
                >
                    <Loader></Loader>
                </Flex>
            )}
            {!isLoggingIn && (
                <Flex
                    flexWrap="wrap"
                    flex="1 0 auto"
                    justifyContent={'space-evenly'}
                >
                    <Box
                        width={['auto']}
                        className={'login-form'}
                        margin={'100px  auto'}
                        as="form"
                        onSubmit={e => e.preventDefault()}
                        p={20}
                        backgroundColor={'#fff'}
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
                                        {error.message}
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
                                    variant="primary"
                                    backgroundColor={'#cf4332'}
                                    onClick={() => {
                                        loginGoogle()
                                    }}
                                >
                                    Login with Google
                                </Button>
                            </Box>
                            <Flex
                                flexWrap="wrap"
                                mt={20}
                                justifyContent={'start'}
                            >
                                <Text mr={3}>Dont have account ?</Text>

                                <Link
                                    sx={{
                                        ':hover': {
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => {
                                        setIsLogin(false)
                                        clearAuthErrors()
                                    }}
                                >
                                    Register
                                </Link>
                            </Flex>
                        </Box>
                    </Box>
                </Flex>
            )}
        </React.Fragment>
    )
}

export default connector(SignIn)
