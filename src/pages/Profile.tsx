import React, { useState, useRef } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Flex, Box, Heading, Text, Card, Image, Button } from 'rebass'
import { useTheme } from 'emotion-theming'

import { RootState, AuthState, Device, DeviceState } from '../types'

import { removeDevice } from '../actions'

import AddPrinter from '../components/AddPrinter'
import Modal from '../components/Modal'
import { Input } from '@rebass/forms'
import { UserControl } from '../components/UserControl'
import { useTransition, useChain, animated } from 'react-spring'

const mapState = (state: RootState): AuthState & DeviceState => {
    return { ...state.auth, ...state.devices }
}

const mapDispatch = {
    removeDevice,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const Profile: React.FC<PropsFromRedux> = ({
    user,
    userDevices,
    removeDevice,
}) => {
    const [showAddModal, setShowAddModal] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const mainTheme = useTheme<any>()

    const transitions = useTransition(edit, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    })

    return (
        <React.Fragment>
            <Flex p={'1rem'} pt={'3%'} justifyContent={'center'}>
                <Box width={[1 / 1, 1 / 2, 1 / 2, 1 / 4]}>
                    <form>
                        <Box minHeight={36}>
                            {transitions.map(({ item, key, props }) =>
                                item ? (
                                    <animated.div key={key} style={props}>
                                        <Input
                                            variant={'inputAuto'}
                                            placeholder={`${user.firstName} ${user.lastName}`}
                                        ></Input>
                                    </animated.div>
                                ) : (
                                    <animated.div key={key} style={props}>
                                        <Heading
                                            color={'primary'}
                                            textAlign={'center'}
                                            fontSize={24}
                                        >
                                            {user.firstName} {user.lastName}
                                        </Heading>
                                    </animated.div>
                                )
                            )}
                        </Box>
                        <Box minHeight={36}>
                            {transitions.map(({ item, key, props }) =>
                                item ? (
                                    <animated.div key={key} style={props}>
                                        <Input
                                            variant={'inputAuto'}
                                            placeholder={
                                                user.username || 'username'
                                            }
                                        ></Input>
                                    </animated.div>
                                ) : (
                                    <animated.div key={key} style={props}>
                                        <Text
                                            color={'gray'}
                                            py={1}
                                            textAlign={'center'}
                                        >
                                            {user.username}
                                        </Text>
                                    </animated.div>
                                )
                            )}
                        </Box>
                        <Box
                            variant={'avatar'}
                            m={'auto'}
                            my={3}
                            sx={{ position: 'relative' }}
                        >
                            <Image src={user.pic} alt="" variant={'avatar'} />
                            <UserControl {...{ setEdit, edit }}></UserControl>
                        </Box>
                        <Box minHeight={36}>
                            {transitions.map(({ item, key, props }) =>
                                item ? (
                                    <animated.div key={key} style={props}>
                                        <Input
                                            variant={'inputAuto'}
                                            placeholder={user.email}
                                        ></Input>
                                    </animated.div>
                                ) : (
                                    <animated.div key={key} style={props}>
                                        <Text
                                            color={'gray'}
                                            py={1}
                                            textAlign={'center'}
                                        >
                                            {user.email}
                                        </Text>
                                    </animated.div>
                                )
                            )}
                        </Box>
                        <Text textAlign={'center'}>Rating: 1000</Text>
                        <Flex
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            my={4}
                        >
                            <Text>My Devices</Text>

                            <Button
                                variant="primary"
                                onClick={e => {
                                    e.preventDefault()
                                    setShowAddModal(true)
                                }}
                            >
                                Add Device
                            </Button>
                        </Flex>
                        <Box marginBottom={4} variant={'hr'}></Box>
                        {userDevices.length <= 0 && (
                            <Text>You have no devices added</Text>
                        )}
                        {userDevices.length > 0 &&
                            userDevices.map((device: Device, i) => (
                                <Card
                                    key={i}
                                    m={'auto'}
                                    mb={3}
                                    p={3}
                                    color="white"
                                    sx={{
                                        position: 'relative',
                                        background: mainTheme.blueGradient,
                                        boxShadow: 'card',
                                        lineHeight: 'body',
                                        borderRadius: 7,
                                    }}
                                >
                                    <Flex
                                        mb={[2]}
                                        justifyContent={'space-between'}
                                        fontSize={3}
                                    >
                                        <Text variant={'heading'}>
                                            {device.brand}
                                        </Text>
                                        <Box>{device.model}</Box>
                                    </Flex>
                                    <Text>Type</Text>
                                    <Text variant={'heading'}>
                                        {device.type}
                                    </Text>
                                    <Text>Materials</Text>
                                    <Text variant={'heading'}>
                                        {device.materials.map((material, i) =>
                                            i === 0
                                                ? material
                                                : `, ${material} `
                                        )}
                                    </Text>
                                    <Text>Dimensions</Text>
                                    <Flex
                                        justifyContent={'space-between'}
                                        alignItems={'center'}
                                    >
                                        <Box>
                                            <Text variant={'heading'}>
                                                {device.dimensions.height} /{' '}
                                                {device.dimensions.width} /{' '}
                                                {device.dimensions.depth}
                                            </Text>
                                        </Box>
                                        <Box
                                            onClick={e => {
                                                e.preventDefault()
                                                removeDevice(
                                                    i,
                                                    userDevices,
                                                    user
                                                )
                                            }}
                                        >
                                            <Text
                                                sx={{
                                                    textDecoration: 'italic',
                                                    ':hover': {
                                                        cursor: 'pointer',
                                                    },
                                                }}
                                                fontSize={1}
                                                color={'background'}
                                            >
                                                remove
                                            </Text>
                                        </Box>
                                    </Flex>
                                </Card>
                            ))}
                    </form>
                </Box>
            </Flex>

            <Modal
                {...{ showModal: showAddModal, setShowModal: setShowAddModal }}
            >
                <AddPrinter
                    {...{
                        toggleModal: setShowAddModal,
                    }}
                />
            </Modal>
        </React.Fragment>
    )
}

export default connector(Profile)
