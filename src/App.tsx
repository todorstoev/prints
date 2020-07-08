import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'
import { Box } from 'rebass'

import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'

import { RootState } from './types'

import { NoMatch } from './pages/404'

const mapState = (state: RootState) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
        user: state.auth.user,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = ({ isAuthenticated, isVerifying }) => {
    return (
        <Box className="App" height={'100%'} style={{ overflow: 'hidden' }}>
            <Box>
                <Switch>
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
            </Box>
        </Box>
    )
}

export default connector(App)
