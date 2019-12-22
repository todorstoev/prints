import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect, ConnectedProps } from 'react-redux'

import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'

import { RootState } from './types'

const mapState = (state: RootState) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const App: React.FC<PropsFromRedux> = ({ isAuthenticated, isVerifying }) => {
    return (
        <div className="App">
            <Switch>
                <ProtectedRoute
                    exact
                    path="/"
                    component={Home}
                    isAuthenticated={isAuthenticated}
                    isVerifying={isVerifying}
                />
                <Route path="/login" component={Login} />
            </Switch>
        </div>
    )
}

export default connector(App)
