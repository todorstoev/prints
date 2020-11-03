import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'

import { RouteComponentProps } from 'react-router-dom'

import { Input } from '@rebass/forms'
import { Box, Button, Flex, Text } from 'rebass'
import { Send } from 'react-feather'

import { AuthState, RoomData, Message, RootState } from '../types'
import { addMessage, getUserRooms } from '../shared/services'

import firebase from '../shared/services/firebase'
import { MessagesList } from '../components/MessagesList'

const MessagesHub: React.FC<RouteComponentProps> = () => {
    const [selectedChat, setSelectedChat] = useState<string>('')

    const [userRooms, setUserRooms] = useState<RoomData[]>([])

    const { user } = useSelector<RootState, AuthState>(state => state.auth)

    const { handleSubmit, register, reset } = useForm()

    const inputEl = useRef<HTMLElement>(null)

    const onSubmit = async (values: any) => {
        const newMessage: Message = {
            author: user.uid as string,
            time: firebase.firestore.FieldValue.serverTimestamp(),
            message: values.message,
        }
        reset()
        await addMessage(newMessage, selectedChat)
    }

    useEffect(() => {
        getUserRooms(user).then(res => {
            setUserRooms(res)
        })
    }, [user])

    return (
        <Flex
            p={'1rem'}
            pt={'8rem'}
            justifyContent={'center'}
            // overflow={'auto'}
            height={'100%'}
        >
            <Box width={1 / 3} px={2} maxHeight={'100%'} overflow="auto">
                {userRooms.map(room => {
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
                            onClick={() => setSelectedChat(room.id)}
                        >
                            <Text>{room.data.title}</Text>
                        </Box>
                    )
                })}
            </Box>
            <Box width={2 / 2} px={4} maxHeight={'100%'}>
                {selectedChat && (
                    <MessagesList {...{ selectedChat, inputRef: inputEl }} />
                )}
                <Box ref={inputEl}>
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
                            name="message"
                            ref={register({ required: true, minLength: 1 })}
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
        </Flex>
    )
}

export default MessagesHub
