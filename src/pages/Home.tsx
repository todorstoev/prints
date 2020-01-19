import React from 'react'

import { connect, ConnectedProps } from 'react-redux'

import { RootState } from '../types'

const mapState = (state: RootState) => {
    return {
        isLoggingOut: state.auth.isLoggingOut,
    }
}

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>
const Home: React.FC<PropsFromRedux> = () => {
    return <div>This is wher map should be</div>
}

export default connector(Home)
