import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { loginUser, registerUser, loginGoogle } from '../actions'
import { RootState } from '../types'
import SignUp from '../components/Signup'
import SignIn from '../components/Signin'
import { Box } from 'rebass'

import { useSpring, animated as a } from 'react-spring'

const mapState = (state: RootState) => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
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

const Login: React.FC<PropsFromRedux> = ({ isAuthenticated }) => {
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
                    <SignIn {...{ setIsLogin }} />
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
                    <SignUp {...{ setIsLogin }} />
                </a.div>
            )}
        </Box>
    )
}

export default connector(Login)
