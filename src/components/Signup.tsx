import React, { useState } from 'react'
import { Heading, Box, Text, Button } from 'rebass'
import { Input } from '@rebass/forms'

const SignUp: React.FC<any> = ({ registerUser, error }) => {
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
                onChange={handleEmailChange}
            />
            <Input
                name={'password'}
                type={'password'}
                className={'password'}
                onChange={handlePasswordChange}
            />
            <Button
                type={'button'}
                onClick={handleSubmit}
                variant="secondary"
                mr={2}
            >
                Register
            </Button>

            {error && <Text>{error}</Text>}
        </Box>
    )
}

export default SignUp
