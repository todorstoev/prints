import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { logoutUser } from '../actions'
import { RootState } from '../types'

const mapState = (state: RootState) => {
    return {
        isLoggingOut: state.auth.isLoggingOut,
        logoutError: state.auth.logoutError,
    }
}

const mapDispatch = {
    logoutUser,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const Home: React.FC<PropsFromRedux> = ({
    isLoggingOut,
    logoutError,
    logoutUser,
}) => {
    const handleLogout = () => logoutUser()
    return (
        <div>
            <h1>This is your app's protected area.</h1>
            <p>Any routes here will also be protected</p>
            <button onClick={handleLogout}>Logout</button>
            {isLoggingOut && <p>Logging Out....</p>}
            {logoutError && <p>Error logging out</p>}
        </div>
    )
}

export default connector(Home)
