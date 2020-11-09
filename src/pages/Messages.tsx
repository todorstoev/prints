import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RouteComponentProps } from 'react-router-dom'

import { Input } from '@rebass/forms'
import { Box, Button, Text } from 'rebass'
import { Send } from 'react-feather'

import { AuthState, RoomData, Message, RootState, Device } from '../types'
import { addMessage, createNewChat, getUserRooms } from '../shared/services'

import firebase from '../shared/services/firebase'
import { MessagesList } from '../components/MessagesList'
import { ChatRoomDetails } from '../components/ChatRoomDetails'

const doesChatExists = (chats: RoomData[], deviceFromLocation: Device) =>
    chats.find((chat) => {
        return chat.data.users.some((id) => id === deviceFromLocation.id)
    })

const MessagesHub: React.FC<RouteComponentProps<any, any, Device>> = ({
    location,
}) => {
    const [selectedChat, setSelectedChat] = useState<string>('')

    const [userRooms, setUserRooms] = useState<RoomData[]>([])

    const [newChat, setNewChat] = useState<RoomData | undefined>()

    const [shoudStartNew, setShouldStartNew] = useState<boolean>(false)

    const [detailsDevice, setDetailsDevice] = useState<RoomData | undefined>()

    const { user } = useSelector<RootState, AuthState>((state) => state.auth)

    const { handleSubmit, register, reset } = useForm()

    const onSubmit = async (values: any) => {
        const newMessage: Message = {
            author: user.uid as string,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            message: values.message,
        }

        reset()

        if (shoudStartNew) await createNewChat(newChat as RoomData)

        await addMessage(newMessage, selectedChat)
    }

    useEffect(() => {
        getUserRooms(user).then((res) => {
            const { state: messagedDevice } = location

            setUserRooms(res)

            if (messagedDevice !== undefined) {
                const chatExist = doesChatExists(res, messagedDevice)

                if (chatExist) {
                    setSelectedChat(chatExist.id)
                } else {
                    const startingNewChat: RoomData = {
                        data: {
                            recieverHasRed: false,
                            title: `${messagedDevice.brand} ${messagedDevice.model}`,
                            users: [
                                user.uid as string,
                                messagedDevice.id as string,
                            ],
                            voted: ['voted'],
                            chatDevice: messagedDevice,
                        },
                        id: `${user.uid}:${messagedDevice.id}`,
                    }

                    setNewChat(startingNewChat)

                    setSelectedChat(startingNewChat.id)

                    setShouldStartNew(true)
                }
            } else {
                if (res[0]) setSelectedChat(res[0].id)
            }
        })
    }, [user, location])

    useEffect(() => {
        if (userRooms) {
            setDetailsDevice(userRooms.find((room) => room.id === selectedChat))
        }
    }, [userRooms, selectedChat])

    return (
        <Box p={'1rem'} pt={['4.5rem', '6rem']} height={'100%'}>
            <Box
                sx={{
                    height: '100%',
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gridGap: '1em',
                    gridTemplateRows: 'auto 1fr auto',
                    gridTemplateAreas: `
                      "details details"
                      "chats messages"
                      "input input"`,
                    '@media screen and (max-width:56em)': {
                        gridTemplateColumns: '1fr',
                        gridTemplateRows: 'auto auto 1fr auto',
                        gridTemplateAreas: `
                        "details"
                        "chats"
                        "messages"
                        "input"`,
                    },
                    '@media screen and (min-width:56em)': {
                        width: '70%',
                        margin: 'auto',
                    },
                }}
            >
                <Box
                    sx={{
                        gridArea: 'details',
                    }}
                    width={'100%'}
                >
                    {(detailsDevice || newChat) && (
                        <ChatRoomDetails
                            {...((detailsDevice as RoomData) ||
                                (newChat as RoomData))}
                        />
                    )}
                </Box>
                {(userRooms.length > 0 || location.state) && (
                    <Box
                        overflow={'auto'}
                        sx={{
                            gridArea: 'chats',
                            '@media screen and (max-width:56em)': {
                                display: 'block',
                                whiteSpace: 'nowrap',
                            },
                        }}
                    >
                        <Box
                            variant={'hr'}
                            mb={2}
                            sx={{
                                '@media screen and (max-width:56em)': {
                                    display: 'block',
                                },
                                '@media screen and (min-width:56em)': {
                                    display: 'none',
                                },
                            }}
                        />
                        <Box
                            overflowX={'auto'}
                            sx={{
                                '::-webkit-scrollbar': { display: 'none' },
                                '@media screen and (min-width:56em)': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                },
                            }}
                        >
                            {newChat && (
                                <Button
                                    variant={'outline'}
                                    mr={2}
                                    mt={[0, 2]}
                                    onClick={() => {
                                        const chatExists = userRooms.find(
                                            (chat) => newChat === chat
                                        )

                                        if (!chatExists) setShouldStartNew(true)

                                        setSelectedChat(newChat.id)
                                    }}
                                >
                                    {newChat.data.title}
                                </Button>
                            )}
                            {userRooms.map((room) => {
                                return (
                                    <Button
                                        variant={'outline'}
                                        key={room.id}
                                        mt={[0, 2]}
                                        mr={2}
                                        onClick={() => {
                                            const chatExists = userRooms.find(
                                                (chat) => room === chat
                                            )
                                            if (chatExists)
                                                setShouldStartNew(false)
                                            setSelectedChat(room.id)
                                        }}
                                    >
                                        {room.data.title}
                                    </Button>
                                )
                            })}
                        </Box>
                        <Box
                            variant={'hr'}
                            mt={2}
                            sx={{
                                '@media screen and (max-width:56em)': {
                                    display: 'block',
                                },
                                '@media screen and (min-width:56em)': {
                                    display: 'none',
                                },
                            }}
                        />
                    </Box>
                )}
                {(userRooms.length > 0 || location.state) && (
                    <>
                        <Box overflow={'hidden'} sx={{ gridArea: 'messages' }}>
                            {selectedChat && (
                                <MessagesList {...{ selectedChat }} />
                            )}
                        </Box>

                        <Box sx={{ gridArea: 'input' }}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                style={{ position: 'relative' }}
                            >
                                <Input
                                    autoComplete={'off'}
                                    placeholder={'Say something'}
                                    sx={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        outline: 'none',
                                        border: 'none',
                                        background: '#80808024',
                                        opacity: selectedChat ? 1 : 0,
                                    }}
                                    pr={5}
                                    name="message"
                                    ref={register({
                                        required: true,
                                        minLength: 1,
                                    })}
                                />
                                <Button
                                    sx={{
                                        top: '-3px',
                                        right: '-7px',
                                        background: 'transparent',
                                        color: 'primary',
                                        position: 'absolute',
                                        opacity: selectedChat ? 1 : 0,
                                        ':active': {
                                            transform: 'scale(0.8)',
                                        },
                                    }}
                                >
                                    <Send
                                        style={{
                                            transform: 'rotate(40deg)',
                                        }}
                                    />
                                </Button>
                            </form>
                        </Box>
                    </>
                )}
                {userRooms.length <= 0 && !location.state && (
                    <Text sx={{ justifySelf: 'center' }} alignSelf={'center'}>
                        Nothing Here
                    </Text>
                )}
            </Box>
        </Box>
    )
}

export default MessagesHub
