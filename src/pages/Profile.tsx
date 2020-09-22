import React, { useState, useRef, RefObject, MutableRefObject } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Flex, Box, Heading, Text, Card, Image, Button } from 'rebass'
import { useTheme } from 'emotion-theming'
import {
    useTransition,
    animated,
    useChain,
    ReactSpringHook,
    config,
} from 'react-spring'

import { useForm } from 'react-hook-form'

import { RootState, AuthState, Device, DeviceState } from '../types'

import { removeDevice, updateUser } from '../shared/store/epics'

import AddPrinter from '../components/AddPrinter'
import Modal from '../components/Modal'
import { Input } from '@rebass/forms'
import { UserControl } from '../components/UserControl'
import { NotificationsHub } from '../components/NotificationsHub'
import { fbErrorMessages } from '../shared/helpers'

const mapState = (state: RootState): AuthState & DeviceState => {
    return { ...state.auth, ...state.devices }
}

const mapDispatch = {
    removeDevice,
    updateUser,
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

const Profile: React.FC<PropsFromRedux> = ({
    user,
    userDevices,
    removeDevice,
    updateUser,
}) => {
    const [showAddModal, setShowAddModal] = useState<boolean>(false)

    const [edit, setEdit] = useState<boolean>(false)

    const { handleSubmit, register, errors } = useForm()

    const mainTheme = useTheme<any>()

    const nameTrsRef = useRef() as RefObject<ReactSpringHook>

    const unameTrsRef = useRef() as RefObject<ReactSpringHook>

    const emailTrsRef = useRef() as RefObject<ReactSpringHook>

    const sbmBtnTrRef = useRef() as RefObject<ReactSpringHook>

    const msgRef = useRef(null)

    const nameTrs = useTransition(edit, null, {
        initial: null,
        from: { position: 'absolute', opacity: 0, transform: 'scale(0)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0)' },
        config: config.stiff,
        ref: nameTrsRef,
    })

    const unameTrs = useTransition(edit, null, {
        initial: null,
        from: { position: 'absolute', opacity: 0, transform: 'rotateX(90deg)' },
        enter: { opacity: 1, transform: 'rotateX(0deg)' },
        leave: { opacity: 0, transform: 'rotateX(90deg)' },
        config: config.stiff,
        ref: unameTrsRef,
    })

    const emailTrs = useTransition(edit, null, {
        initial: null,
        from: { position: 'absolute', opacity: 0, transform: 'rotateX(90deg)' },
        enter: { opacity: 1, transform: 'rotateX(0deg)' },
        leave: { opacity: 0, transform: 'rotateX(90deg)' },
        config: config.stiff,
        ref: emailTrsRef,
    })

    useChain(
        edit
            ? [nameTrsRef, unameTrsRef, emailTrsRef, sbmBtnTrRef]
            : [sbmBtnTrRef, emailTrsRef, unameTrsRef, nameTrsRef],
        [0, 0.4, 0.6, 0.8]
    )

    const onSubmit = async (data: any, e: any) => {
        try {
            await updateUser(user, data)
            ;(msgRef as MutableRefObject<any>).current(
                `User ${user.email} updated`
            )
            setEdit(false)
        } catch (e) {
            ;(msgRef as MutableRefObject<any>).current(`${fbErrorMessages(e)}`)
        }
    }

    for (const error in errors) {
        if (errors[`${error}`].message) {
            ;(msgRef as MutableRefObject<any>).current(
                errors[`${error}`].message
            )
        }
    }

    return (
        <React.Fragment>
            <Flex p={'1rem'} pt={'3%'} justifyContent={'center'}>
                <Box width={[1 / 1, 1 / 2, 1 / 2, 1 / 4]}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'column'}
                        >
                            <Flex
                                sx={{
                                    position: 'relative',
                                    height: 90,
                                    width: '100%',
                                }}
                                justifyContent={'center'}
                                alignItems={'center'}
                            >
                                {nameTrs.map(({ item, key, props }) =>
                                    item ? (
                                        <animated.div
                                            key={key}
                                            style={{
                                                opacity: props.opacity,
                                                position: props.position,
                                                transform: props.transform,
                                            }}
                                        >
                                            <Box mb={2}>
                                                <Input
                                                    ref={register({
                                                        validate: value =>
                                                            value !== 'admin' ||
                                                            'Nice try!',
                                                    })}
                                                    variant={'inputAuto'}
                                                    name={'firstName'}
                                                    placeholder={'first name'}
                                                    defaultValue={
                                                        user.firstName
                                                    }
                                                ></Input>
                                            </Box>
                                            <Box>
                                                <Input
                                                    ref={register({
                                                        validate: value =>
                                                            value !== 'admin' ||
                                                            'Nice try!',
                                                    })}
                                                    variant={'inputAuto'}
                                                    name={'lastName'}
                                                    placeholder={'last name'}
                                                    defaultValue={user.lastName}
                                                ></Input>
                                            </Box>
                                        </animated.div>
                                    ) : (
                                        <animated.div
                                            key={key}
                                            style={{
                                                opacity: props.opacity,
                                                position: props.position,
                                            }}
                                        >
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
                            </Flex>

                            <Flex
                                justifyContent={'center'}
                                alignItems={'center'}
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '50px',
                                }}
                            >
                                {unameTrs.map(({ item, key, props }) =>
                                    item ? (
                                        <animated.div
                                            key={key}
                                            style={{
                                                opacity: props.opacity,
                                                position: props.position,
                                                transform: props.transform,
                                            }}
                                        >
                                            <Input
                                                ref={register({
                                                    validate: value =>
                                                        value !== 'admin' ||
                                                        'Nice try!',
                                                })}
                                                variant={'inputAuto'}
                                                placeholder={'username'}
                                                defaultValue={user.username}
                                                name={'username'}
                                            ></Input>
                                        </animated.div>
                                    ) : (
                                        <animated.div
                                            key={key}
                                            style={{
                                                opacity: props.opacity,
                                                position: props.position,
                                            }}
                                        >
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
                            </Flex>
                        </Flex>

                        <Box
                            variant={'avatar'}
                            m={'auto'}
                            my={3}
                            sx={{
                                position: 'relative',
                                boxShadow:
                                    '20px 20px 60px #d9d9d9,  -20px -20px 60px #ffffff',
                            }}
                        >
                            <Image src={user.pic} alt="" variant={'avatar'} />
                            <UserControl
                                {...{ setEdit, edit, sbmBtnTrRef }}
                            ></UserControl>
                        </Box>
                        <Flex
                            mt={4}
                            mb={2}
                            minHeight={36}
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'column'}
                        >
                            {emailTrs.map(({ item, key, props }) =>
                                item ? (
                                    <animated.div
                                        key={key}
                                        style={{
                                            opacity: props.opacity,
                                            position: props.position,
                                            transform: props.transform,
                                        }}
                                    >
                                        <Input
                                            ref={register({
                                                required: 'Email is Required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message:
                                                        'Invalid email address',
                                                },
                                            })}
                                            sx={{
                                                borderColor: errors.email
                                                    ? 'error'
                                                    : 'secondary',
                                            }}
                                            name={'email'}
                                            variant={'inputAuto'}
                                            defaultValue={user.email}
                                        ></Input>
                                    </animated.div>
                                ) : (
                                    <animated.div
                                        key={key}
                                        style={{
                                            opacity: props.opacity,
                                            position: props.position,
                                            transform: props.transform,
                                        }}
                                    >
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
                        </Flex>
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
                        <Box sx={{ overflowY: 'auto' }}>
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
                                            {device.materials.map(
                                                (material, i) =>
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
                                                    ;(msgRef as MutableRefObject<
                                                        any
                                                    >).current(
                                                        `${device.brand} ${device.model} removed`
                                                    )
                                                }}
                                            >
                                                <Text
                                                    sx={{
                                                        textDecoration:
                                                            'italic',
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
                        </Box>
                    </form>
                </Box>
            </Flex>
            <NotificationsHub children={(add: any) => (msgRef.current = add)} />
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
