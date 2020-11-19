import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { animated, useTransition } from 'react-spring';
import { Box, Flex, Text } from 'rebass';
import { getUserMessages } from '../shared/services';

import { AuthState, ChatState, Message, RootState } from '../types';

type Props = {
  selectedChat: string;
};

export const MessagesList: React.FC<Props> = ({ selectedChat }) => {
  const [messages, setMessages] = useState<Message[] | undefined>(undefined);

  const { user } = useSelector<RootState, AuthState & ChatState>((state) => ({
    ...state.auth,
    ...state.chat,
  }));

  const chatContainer = useRef<HTMLElement>(null);

  const transitions = useTransition(typeof messages === 'undefined', null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  useEffect(() => {
    const observable = getUserMessages(selectedChat);

    const subscription = observable.subscribe({
      next: (snapshot) => {
        setMessages(snapshot);

        chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
      },
    });

    return () => subscription.unsubscribe();
  }, [selectedChat]);

  return (
    <>
      {transitions.map(({ item, key, props }) =>
        item ? (
          <animated.div
            key={key}
            style={{ ...props, width: '100%', height: '100%', position: 'absolute' }}
          ></animated.div>
        ) : (
          <animated.div key={key} style={{ ...props, width: '100%', height: '100%' }}>
            {' '}
            <Flex
              pr={'7px'}
              ref={chatContainer}
              height={'100%'}
              flexDirection={'column'}
              overflow="auto"
              sx={{
                '::-webkit-scrollbar': {
                  width: '5px',
                },
                '::-webkit-scrollbar-track': {
                  bg: 'mute',
                },
                '::-webkit-scrollbar-thumb': {
                  bg: '#70c1e636',
                },
                '::-webkit-scrollbar-thumb:hover': {
                  bg: 'secondary',
                },
              }}
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
              {(messages as Message[])?.length > 0 &&
                (messages as Message[]).map((message, i) => {
                  const variant = message.author === user.uid ? 'myMessage' : 'message';
                  return (
                    <Box key={`${message.message}${i}`} variant={variant}>
                      <Text width={'100%'} sx={{ overflowWrap: 'break-word' }}>
                        {message.message}
                      </Text>
                    </Box>
                  );
                })}
            </Flex>
          </animated.div>
        ),
      )}
    </>
  );
};
