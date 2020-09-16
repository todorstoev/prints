import React from 'react'
import { Map, MessageCircle } from 'react-feather'
import { connect, ConnectedProps } from 'react-redux'
import { Link } from 'react-router-dom'
import { Box, Image } from 'rebass'

import { RootState } from '../types'

const mapState = (state: RootState) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        user: state.auth.user,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    location: any
}

const Navigation: React.FC<Props> = ({ user, location }) => (
    <>
        <Box
            variant={'navAvatar'}
            m={'auto'}
            my={3}
            sx={{
                position: 'absolute',
                top: 0,
                left: '2em',
                bg: 'transperent',
                '@media screen and (max-width: 64em)': {
                    left: '0.2em',
                    top: '-1em',
                },
            }}
        >
            <Link to={'/'}>
                <Image
                    backgroundColor={'transparent'}
                    src={'./assets/orb.png'}
                    variant={'navAvatar'}
                />
            </Link>
        </Box>
        <Box
            variant={'navAvatar'}
            m={'auto'}
            my={3}
            sx={{
                position: 'absolute',
                top: 0,
                right: '2em',
                background: 'transparent',
                '@media screen and (max-width: 64em)': {
                    right: '0.2em',
                    top: '-1em',
                },
            }}
        >
            {location.pathname === '/' && (
                <Link to={'/profile'}>
                    <Image
                        backgroundColor={'#fff'}
                        src={user.pic}
                        variant={'navAvatar'}
                    />
                </Link>
            )}

            {location.pathname === '/profile' && (
                <Link to={'/'}>
                    <Box
                        color="primary"
                        variant={'navAvatar'}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: 'small',
                        }}
                    >
                        <Map size={42}></Map>
                    </Box>
                </Link>
            )}
        </Box>
        <Box
            variant={'navAvatar'}
            m={'auto'}
            my={3}
            sx={{
                position: 'absolute',
                bottom: 0,
                right: '2em',
                bg: 'transperent',
                '@media screen and (max-width: 40em)': {
                    right: '60px',
                    top: '-1em',
                },
            }}
        >
            <Link to={'/messages'}>
                <Box
                    bg="#fff"
                    color="primary"
                    variant={'navAvatar'}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: 'small',
                    }}
                >
                    <MessageCircle size={42}></MessageCircle>
                </Box>
            </Link>
        </Box>
    </>
)

export default connector(Navigation)
