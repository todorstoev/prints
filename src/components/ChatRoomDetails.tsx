import { useTheme } from 'emotion-theming'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Box, Flex, Text, Heading, Button } from 'rebass'
import { ChevronUp, ChevronDown } from 'react-feather'

import MapMarker from '../components/MapMarker'
import Map from '../components/Map'
import { RoomData } from '../types'

import { actions } from '../shared/store'

export enum Vote {
    Up = 'UP',
    Down = 'DOWN',
}

export const ChatRoomDetails: React.FC<RoomData> = ({ data, id }) => {
    const mainTheme = useTheme<any>()

    const dispatch = useDispatch()

    return (
        <Flex
            bg={[mainTheme.bwGradientSmall, mainTheme.bwGradient]}
            sx={{
                borderRadius: 5,
            }}
            color={'background'}
            p={[0, 3]}
            height={[300, 300, 150]}
        >
            {data && (
                <Box
                    width={'100%'}
                    sx={{
                        display: 'grid',
                        gridGap: 3,
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(128px, 1fr))',
                        '@media screen and (max-width:56em)': {
                            gridTemplateColumns: ' repeat(1, 1fr)',
                        },
                    }}
                >
                    <Flex
                        justifyContent={[
                            'space-evenly',
                            'space-evenly',
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
                                {data.chatDevice.brand} {data.chatDevice.model}
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
                                    {data.chatDevice.dimensions.height} /{' '}
                                    {data.chatDevice.dimensions.width} /{' '}
                                    {data.chatDevice.dimensions.depth}
                                </Text>
                            </Box>
                        </Flex>
                    </Flex>
                    <Box>
                        <Flex
                            alignItems={['center', 'center', 'flex-end']}
                            height={'100%'}
                            flexDirection={'column'}
                            justifyContent={'space-evenly'}
                        >
                            <Heading color="primary">
                                Rating : {data.chatDevice.rating}
                            </Heading>
                            <Box>
                                <Button
                                    mr={1}
                                    disabled={data.voted}
                                    onClick={() => {
                                        if (data.voted) return

                                        dispatch(
                                            actions.voteUserRequest({
                                                vote: Vote.Down,
                                                roomData: { data, id },
                                            })
                                        )
                                        ;(data.chatDevice.rating as number)--
                                        data.voted = true
                                    }}
                                >
                                    <ChevronDown />
                                </Button>
                                <Button disabled={data.voted}>
                                    <ChevronUp
                                        onClick={() => {
                                            if (data.voted) return
                                            dispatch(
                                                actions.voteUserRequest({
                                                    vote: Vote.Up,
                                                    roomData: { data, id },
                                                })
                                            )
                                            ;(data.chatDevice
                                                .rating as number)++
                                            data.voted = true
                                        }}
                                    />
                                </Button>
                            </Box>
                        </Flex>
                    </Box>
                </Box>
            )}
        </Flex>
    )
}
