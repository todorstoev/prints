import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, Flex, Text } from 'rebass'
import { getUserMessages } from '../shared/services'
import { AuthState, Message, RootState } from '../types'

type Props = {
    selectedChat: string
}

export const MessagesList: React.FC<Props> = ({ selectedChat }) => {
    const [messages, setMessages] = useState<Message[]>([])

    const { user } = useSelector<RootState, AuthState>((state) => state.auth)

    const chatContainer = useRef<HTMLElement>(null)

    useEffect(() => {
        const observable = getUserMessages(selectedChat)

        const subscription = observable.subscribe({
            next: (snapshot) => {
                setMessages(snapshot)
                chatContainer.current?.scrollTo(
                    0,
                    chatContainer.current.scrollHeight
                )
            },
        })

        return () => subscription.unsubscribe()
    }, [selectedChat])

    return (
        <Flex
            pr={'7px'}
            ref={chatContainer}
            height={'100%'}
            flexDirection={'column'}
            overflow="auto"
        >
            {messages?.length === 0 && (
                <Flex
                    alignItems={'center'}
                    justifyContent={'center'}
                    height={'100%'}
                    width={'100%'}
                >
                    <Text>There is still no messages here</Text>
                </Flex>
            )}
            {messages?.length > 0 &&
                messages.map((message, i) => {
                    const variant =
                        message.author === user.uid ? 'myMessage' : 'message'
                    return (
                        <Box key={`${message.message}${i}`} variant={variant}>
                            <Text
                                width={'100%'}
                                sx={{ overflowWrap: 'break-word' }}
                            >
                                {message.message}
                            </Text>
                        </Box>
                    )
                })}
        </Flex>
    )
}
