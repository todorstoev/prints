import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../types'
import { getUserChats } from '../utils'

const mapState = (state: RootState) => {
    return {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated,
        isVerifying: state.auth.isVerifying,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

const Messages: React.FC<PropsFromRedux> = ({ user }) => {
    useEffect(() => {}, [])

    return <div>Hello</div>
}

export default connector(Messages)
