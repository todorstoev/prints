import React, { useState } from 'react'

const SignUp: React.FC<any> = ({ registerUser, loginError }) => {
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
        <div>
            <h1>Sign Up</h1>
            <input
                name={'email'}
                className={'email'}
                onChange={handleEmailChange}
            />
            <input
                name={'password'}
                type={'password'}
                className={'password'}
                onChange={handlePasswordChange}
            />
            <button type={'button'} onClick={handleSubmit}>
                Register
            </button>
            {loginError && <div>{loginError}</div>}
        </div>
    )
}

export default SignUp
