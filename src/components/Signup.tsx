import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { registerUser, clearAuthErrors } from '../actions'
import { Heading, Box, Text, Button, Flex, Link } from 'rebass'
import { Input, Label } from '@rebass/forms'
import { theme } from '../theme'
import { RootState } from '../types'

const mapState = (state: RootState) => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        error: state.auth.error,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

const mapDispatch = {
    registerUser,
    clearAuthErrors,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    setIsLogin: (login: boolean) => void
}

const SignUp: React.FC<Props> = ({
    registerUser,
    error,
    setIsLogin,
    clearAuthErrors,
}) => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    

    const handleEmailChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setEmail(currentTarget.value)

    const handlePasswordChange = ({
        currentTarget,
    }: React.FormEvent<HTMLInputElement>) => setPassword(currentTarget.value)

    const handleSubmit = () => registerUser(email, password)
    return (
        <Flex flexWrap="wrap" flex="1 0 auto" justifyContent={'space-evenly'}>
            <Box
                width={['auto']}
                className={'signup-form'}
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
                        <Heading fontSize={[5, 6, 7]}>Sign Up</Heading>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            name={'email'}
                            className={'email'}
                            mt={2}
                            onChange={handleEmailChange}
                        />
                        <Label htmlFor="password">Password</Label>
                        <Input
                            name={'password'}
                            type={'password'}
                            className={'password'}
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
                        <Box mt={10} width={[1 / 1]}>
                            <Button
                                type={'button'}
                                onClick={handleSubmit}
                                variant="primary"
                                width={[1 / 1]}
                            >
                                Register
                            </Button>

                            <Flex
                                flexWrap="wrap"
                                mt={20}
                                justifyContent={'start'}
                            >
                                <Text mr={3}>Allready have an account ?</Text>

                                <Link
                                    sx={{
                                        ':hover': {
                                            cursor: 'pointer',
                                        },
                                    }}
                                    onClick={() => {
                                        setIsLogin(true)
                                        clearAuthErrors()
                                    }}
                                >
                                    Log In
                                </Link>
                            </Flex>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default connector(SignUp)
