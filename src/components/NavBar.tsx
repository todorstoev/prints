import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../types'
import { Flex, Text, Link, Box } from 'rebass'
import { logoutUser } from '../actions'

const mapStateToProps = (state: RootState) => {
    return state.auth
}

const mapDispatch = {
    logoutUser,
}
    
const connector = connect(mapStateToProps, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const NavBar: React.FC<PropsFromRedux> = ({ isAuthenticated, logoutUser }) => {
    return (
        <Flex px={2} color="white" bg="black" alignItems="center">
            <Text p={2} fontWeight="bold">
                3DReact
            </Text>
            <Box mx="auto" />
            {isAuthenticated && (
                <Link variant="nav" href="/devices">
                    Devices
                </Link>
            )}
            <Link variant="nav" href="/about">
                About
            </Link>
            {!isAuthenticated && (
                <Link variant="nav" href="/login">
                    Log In
                </Link>
            )}
            {isAuthenticated && (
                <Link variant="nav" onClick={() => logoutUser()}>
                    Log Out
                </Link>
            )}
        </Flex>
    )
}

export default connector(NavBar)
