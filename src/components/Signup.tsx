import React, { useState } from 'react'
import { Heading, Box, Text, Button } from 'rebass'
import { Input } from '@rebass/forms'

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
        <Box sx={{ margin: 'auto', width: '30%' }}>
            <Heading fontSize={[5, 6, 7]}>Sign Up</Heading>

            <Input
                name={'email'}
                className={'email'}
                mt={2}
                onChange={handleEmailChange}
            />
            <Input
                name={'password'}
                type={'password'}
                className={'password'}
                mt={2}
                mb={2}
                onChange={handlePasswordChange}
            />
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
            {error && (
                <Text color="error" mt={2}>
                    {error}
                </Text>
            )}
        </Box>
    )
}

export default SignUp
