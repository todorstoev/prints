import React from 'react'

import { Box } from 'rebass'
import { RootState } from '../types'
import { connect, ConnectedProps } from 'react-redux'

const mapStateToProps = (state: RootState) => state.auth

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector>

const Profile: React.FC<PropsFromRedux> = ({ user }) => {
    return (
        <Box>
            <Box>{user.firstName}</Box>
            <Box>{user.lastName}</Box>
            <Box>{user.username}</Box>
            <Box>{user.email}</Box>
        </Box>
    )
}

export default connector(Profile)
