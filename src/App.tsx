import React from 'react'
import { Route, Switch, useLocation, Link } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { Box, Image } from 'rebass'
import { Map } from 'react-feather'

import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

import { RootState } from './types'

import { NoMatch } from './pages/404'
import { useTransition, animated } from 'react-spring'

const mapState = (state: RootState) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        user: state.auth.user,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = ({
    isAuthenticated,
    isVerifying,
    user,
}) => {
    const location = useLocation()

    const transitions = useTransition(location, location => location.pathname, {
        from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    })

    return (
        <Box
            className="App"
            height={'100vh'}
            width={'100%'}
            style={{ overflowX: 'hidden' }}
        >
            {transitions.map(({ item: location, props, key }) => (
                <animated.div
                    key={key}
                    style={{
                        ...props,
                        height: '100%',
                        position: 'absolute',
                        width: '100%',
                    }}
                >
                    <Switch location={location}>
                        <ProtectedRoute
                            exact
                            path="/"
                            component={Home}
                            isAuthenticated={isAuthenticated}
                            isVerifying={isVerifying}
                        />
                        <Route path="/login" component={Login} />
                        <ProtectedRoute
                            exact
                            path="/profile"
                            component={Profile}
                            isAuthenticated={isAuthenticated}
                            isVerifying={isVerifying}
                        />
                        <Route component={NoMatch} />
                    </Switch>
                </animated.div>
            ))}
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
        </Box>
    )
}

export default connector(App)
