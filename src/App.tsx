import React from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { Box } from 'rebass'

import { useTransition, animated } from 'react-spring'

import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'

import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

import { RootState } from './types'
import { NoMatch } from './pages/404'
import { Messages } from './pages/Messages'

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
        from: { opacity: 0, transform: 'translate3d(2%,0,0)' },
        enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
        leave: { opacity: 0, transform: 'translate3d(-2%,0,0)' },
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
                        <ProtectedRoute
                            exact
                            path="/messages"
                            component={Messages}
                            isAuthenticated={isAuthenticated}
                            isVerifying={isVerifying}
                        />
                        <Route component={NoMatch} />
                    </Switch>
                </animated.div>
            ))}
            <Navigation location={location} />
        </Box>
    )
}

export default connector(App)
