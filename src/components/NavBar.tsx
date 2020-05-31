import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../types'
import { Flex, Box, Link, Text } from 'rebass'
import { logoutUser } from '../actions'

const mapStateToProps = (state: RootState) => state.auth

const mapDispatch = {
    logoutUser,
}

const connector = connect(mapStateToProps, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    close: any
}

const NavBar: React.FC<Props> = ({ user, logoutUser }) => {
    if (!user) return <div></div>

    return (
        <Flex
            width={['50vw', '50vw', '25vw']}
            bg={'#fff'}
            height={'100%'}
            sx={{ boxShadow: 'card' }}
            flexDirection="column"
            alignItems="center"
            justifyContent="start"
        >
            <Box>
                <Link variant="nav" href="/">
                    <Text color={'primary'}>Map</Text>
                </Link>
            </Box>

            <Box>
                <Link variant="nav" href="/profile">
                    <Text color={'primary'}>Profile</Text>
                </Link>
            </Box>

            <Box variant="nav" onClick={() => logoutUser()}>
                <Text color={'primary'}>Log Out</Text>
            </Box>
        </Flex>
    )
}

export default connector(NavBar)
