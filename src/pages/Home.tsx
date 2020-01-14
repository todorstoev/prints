import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { logoutUser } from '../actions'
import { RootState } from '../types'

const mapState = (state: RootState) => {
    return {
        isLoggingOut: state.auth.isLoggingOut,
        error: state.auth.error,
    }
}

const mapDispatch = {
    logoutUser,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const Home: React.FC<PropsFromRedux> = ({
    isLoggingOut,
    error,
    logoutUser,
}) => {
    const handleLogout = () => logoutUser()
    return <div>This is wher map should be</div>
}

export default connector(Home)
