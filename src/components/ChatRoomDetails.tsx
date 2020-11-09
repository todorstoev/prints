import { useTheme } from 'emotion-theming'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Heading, Button } from 'rebass'
import { ChevronDown, ChevronUp, Plus, Minus } from 'react-feather'

import MapMarker from '../components/MapMarker'
import Map from '../components/Map'
import { AuthState, RoomData, RootState } from '../types'

import { actions } from '../shared/store'

export enum Vote {
    Up = 'UP',
    Down = 'DOWN',
}

export const ChatRoomDetails: React.FC<RoomData> = ({ data, id }) => {
    const mainTheme = useTheme<any>()

    const dispatch = useDispatch()

    const [stretched, setStretched] = useState<boolean>(true)

    const [voted, setVoted] = useState<boolean>(false)

    const { user } = useSelector<RootState, AuthState>((state) => state.auth)

    useEffect(() => {
        if (data.voted.find((id) => id === 'voted')) {
            setVoted(true)
            data.voted = []
            return
        }
        if (data.voted.find((id) => id === user.uid)) {
            setVoted(true)
        }
    }, [user, data.voted])

    return (
        <Flex
            bg={[mainTheme.bwGradientSmall, mainTheme.bwGradient]}
            sx={{
                borderRadius: 5,
                position: 'relative',
            }}
            color={'background'}
            p={[0, 3]}
            height={['auto', !stretched ? 150 : 'auto']}
        >
            <Box
                color={'primary'}
                sx={{ position: 'absolute', right: 0, top: 0 }}
            >
                {stretched && (
                    <ChevronDown
                        onClick={() => setStretched(false)}
                        style={{ cursor: 'pointer' }}
                    />
                )}
                {!stretched && (
                    <ChevronUp
                        onClick={() => setStretched(true)}
                        style={{ cursor: 'pointer' }}
                    />
                )}
            </Box>
            {data &&
                (!stretched ? (
                    <Box width={'100%'} height={'100%'}>
                        <Box
                            sx={{
                                display: 'grid',
                                gridGap: 3,
                                height: '100%',
                                gridTemplateColumns: 'auto 1fr',
                                '@media screen and (max-width:56em)': {
                                    gridTemplateColumns: ' repeat(1, 1fr)',
                                    gridGap: 0,
                                },
                            }}
                        >
                            <Flex
                                height={'100%'}
                                justifyContent={[
                                    'space-between',
                                    'space-between',
                                    'flex-start',
                                ]}
                            >
                                <Box
                                    height={'100%'}
                                    width={150}
                                    sx={{
                                        borderRadius: 5,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Map
                                        dragging={false}
                                        zoom={13}
                                        center={data.chatDevice.location}
                                        controls={false}
                                    >
                                        <MapMarker
                                            position={data.chatDevice.location}
                                        ></MapMarker>
                                    </Map>
                                </Box>
                                <Flex
                                    pl={3}
                                    flexDirection={'column'}
                                    justifyContent={'space-evenly'}
                                >
                                    <Heading color={['primary', 'background']}>
                                        {data.chatDevice.brand}{' '}
                                        {data.chatDevice.model}
                                    </Heading>
                                    <Text color={['primary', 'background']}>
                                        Type : {data.chatDevice.type}
                                    </Text>
                                    <Text color={['primary', 'background']}>
                                        Materials:{' '}
                                        {data.chatDevice.materials.join(', ')}
                                    </Text>
                                    <Box>
                                        <Text color={['primary', 'background']}>
                                            Dimensions:{' '}
                                            {data.chatDevice.dimensions.height}{' '}
                                            / {data.chatDevice.dimensions.width}{' '}
                                            / {data.chatDevice.dimensions.depth}
                                        </Text>
                                    </Box>
                                    {data.chatDevice.id === user.uid && (
                                        <Box>
                                            <Text
                                                color={[
                                                    'primary',
                                                    'background',
                                                ]}
                                            >
                                                (This device is yours)
                                            </Text>
                                        </Box>
                                    )}
                                </Flex>
                            </Flex>
                            <Box>
                                <Box mt={2} />
                                <Flex
                                    alignItems={[
                                        'center',
                                        'center',
                                        'flex-end',
                                    ]}
                                    height={'100%'}
                                    flexDirection={'column'}
                                    justifyContent={'space-evenly'}
                                >
                                    <Heading color="primary" my={2}>
                                        Rating : {data.chatDevice.rating}
                                    </Heading>
                                    <Box>
                                        <Button
                                            mr={1}
                                            disabled={voted}
                                            onClick={() => {
                                                if (voted) return

                                                dispatch(
                                                    actions.voteUserRequest({
                                                        vote: Vote.Down,
                                                        roomData: { data, id },
                                                    })
                                                )
                                                ;(data.chatDevice
                                                    .rating as number)--
                                                setVoted(true)
                                            }}
                                        >
                                            <Minus />
                                        </Button>
                                        <Button
                                            disabled={voted}
                                            onClick={() => {
                                                if (voted) return
                                                dispatch(
                                                    actions.voteUserRequest({
                                                        vote: Vote.Up,
                                                        roomData: { data, id },
                                                    })
                                                )
                                                ;(data.chatDevice
                                                    .rating as number)++
                                                setVoted(true)
                                            }}
                                        >
                                            <Plus />
                                        </Button>
                                    </Box>
                                </Flex>
                            </Box>
                        </Box>
                    </Box>
                ) : (
                    <Heading color={['primary', 'background']}>
                        {data.chatDevice.brand} {data.chatDevice.model}
                    </Heading>
                ))}
        </Flex>
    )
}
