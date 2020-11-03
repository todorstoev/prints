import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Box, Flex, Text } from 'rebass'
import { getUserMessages } from '../shared/services'
import { AuthState, Message, RootState } from '../types'

type Props = {
    inputRef: React.RefObject<HTMLElement>
    selectedChat: string
}

export const MessagesList: React.FC<Props> = ({ inputRef, selectedChat }) => {
    const [messages, setMessages] = useState<Message[]>([])

    const { user } = useSelector<RootState, AuthState>(state => state.auth)

    const chatContainer = useRef<HTMLElement>(null)

    useEffect(() => {
        const observable = getUserMessages(selectedChat)

        observable.subscribe({
            next: snapshot => {
                setMessages(snapshot)
                chatContainer.current?.scrollTo(
                    0,
                    chatContainer.current.scrollHeight
                )
            },
        })
    }, [selectedChat])

    return (
        <Flex
            ref={chatContainer}
            flexDirection={'column'}
            overflow="auto"
            height={`calc(100% - ${
                inputRef.current?.getBoundingClientRect().height
            }px)`}
        >
            {messages?.length > 0 &&
                messages.map((message, i) => {
                    const variant =
                        message.author === user.uid ? 'myMessage' : 'message'
                    return (
                        <Box key={`${message.message}${i}`} variant={variant}>
                            <Text>{message.message}</Text>
                        </Box>
                    )
                })}
        </Flex>
    )
}
