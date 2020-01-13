import React, { useState } from 'react'
import { Heading, Box, Text, Button, Flex } from 'rebass'
import { Input, Label } from '@rebass/forms'

const SignUp: React.FC<any> = ({ registerUser, error, setIsLogin }) => {
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
                width={[1 / 2, 1 / 2, 1 / 3, 1 / 5]}
                className={'signup-form'}
                margin={'10% auto'}
                as="form"
                onSubmit={e => e.preventDefault()}
                p={20}
                backgroundColor={'#fff'}
            >
                <Box
                    p={1}
                    sx={{
                        borderRadius: 6,
                        backgroundImage:
                            'linear-gradient(to left, #00f260, #0575e6);',
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
                        <Box mt={20}>
                            <Button
                                type={'button'}
                                onClick={handleSubmit}
                                variant="primary"
                                mr={2}
                            >
                                Register
                            </Button>
                            <Button
                                variant="secondary"
                                mr={2}
                                onClick={() => {
                                    setIsLogin(true)
                                }}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Flex>
    )
}

export default SignUp
