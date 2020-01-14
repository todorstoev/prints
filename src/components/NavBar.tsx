import React from 'react'
import { connect } from 'react-redux'
import { RootState, AuthState } from '../types'
import { Flex, Text, Link, Box } from 'rebass'

export interface OwnProps {
    propFromParent: number
}

const mapStateToProps = (state: RootState) => {
    return state.auth
}

interface StateProps {
    propFromReduxStore: string
}

const connector = connect(mapStateToProps)

const NavBar: React.FC<AuthState> = ({ isAuthenticated }) => {
    return (
        <Flex px={2} color="white" bg="black" alignItems="center">
            <Text p={2} fontWeight="bold">
                3DReact
            </Text>
            <Box mx="auto" />
            {isAuthenticated && (
                <Link variant="nav" href="/about">
                    Device
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
        </Flex>
    )
}

export default connector(NavBar)
