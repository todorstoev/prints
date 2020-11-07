import React, { useEffect, useState, useRef } from 'react'
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
import { useTheme } from 'emotion-theming'

const doesChatExists = (chats: RoomData[], deviceFromLocation: Device) =>
    chats.find((chat) => {
        return chat.data.users.some((id) => id === deviceFromLocation.id)
    })

const MessagesHub: React.FC<RouteComponentProps<any, any, Device>> = ({
    location,
}) => {
    const [selectedChat, setSelectedChat] = useState<string>('')

    const [userRooms, setUserRooms] = useState<RoomData[]>([])

    const [newChat, setNewChat] = useState<RoomData | null>(null)

    const [shoudStartNew, setShouldStartNew] = useState<boolean>(false)

    const { user } = useSelector<RootState, AuthState>((state) => state.auth)

    const { handleSubmit, register, reset } = useForm()

    const inputElRef = useRef<HTMLElement>(null)

    const chatDetailsRef = useRef<Element>(null)

    const mainTheme = useTheme<any>()

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
                            voted: false,
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

    return (
        <Box p={'1rem'} pt={'8rem'} height={'100%'}>
            <Box width={'100%'} mb={4} mt={1} ref={chatDetailsRef}>
                {(userRooms.length > 0 || location.state) && (
                    <ChatRoomDetails
                        {...(userRooms.length > 0
                            ? (userRooms.find(
                                  (room) => room.id === selectedChat
                              ) as RoomData)
                            : (newChat as RoomData))}
                    />
                )}
            </Box>
            <Box
                sx={{
                    display: 'grid',
                    gridGap: 3,
                    gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
                    '@media screen and (max-width:56em)': {
                        gridTemplateColumns: ' repeat(1, 1fr)',
                    },
                }}
                height={[
                    'auto',
                    `calc(100% - ${
                        (chatDetailsRef.current?.getBoundingClientRect()
                            .height as number) +
                        mainTheme.space[4] +
                        mainTheme.space[1]
                    }px)`,
                ]}
            >
                {(userRooms.length > 0 || location.state) && (
                    <Box maxHeight={'100%'} overflow="auto">
                        {newChat && (
                            <Box>
                                <Box
                                    sx={{
                                        color:
                                            selectedChat === newChat.id
                                                ? 'secondary'
                                                : 'primary',
                                    }}
                                    height={'2em'}
                                    variant={'link'}
                                    py={2}
                                    onClick={() => {
                                        const chatExists = userRooms.find(
                                            (chat) => newChat === chat
                                        )

                                        if (!chatExists) setShouldStartNew(true)

                                        setSelectedChat(newChat.id)
                                    }}
                                >
                                    <Text>{newChat.data.title}</Text>
                                </Box>
                            </Box>
                        )}
                        {userRooms.map((room) => {
                            return (
                                <Box
                                    sx={{
                                        color:
                                            selectedChat === room.id
                                                ? 'secondary'
                                                : 'primary',
                                    }}
                                    key={room.id}
                                    height={'2em'}
                                    variant={'link'}
                                    py={2}
                                    onClick={() => {
                                        const chatExists = userRooms.find(
                                            (chat) => room === chat
                                        )
                                        if (chatExists) setShouldStartNew(false)
                                        setSelectedChat(room.id)
                                    }}
                                >
                                    <Text>{room.data.title}</Text>
                                </Box>
                            )
                        })}
                    </Box>
                )}
                {(userRooms.length > 0 || location.state) && (
                    <Box maxHeight={'100%'}>
                        {selectedChat && (
                            <MessagesList
                                {...{ selectedChat, inputRef: inputElRef }}
                            />
                        )}
                        <Box ref={inputElRef}>
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
                                    mt={2}
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
                    </Box>
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
