import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Flex, Text } from 'rebass';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from 'react-loader-spinner';

import { getNewMessage, getUserMessages, loadMoreMessages } from '../shared/services';

import { AuthState, ChatState, Message, RootState } from '../types';
import { actions } from '../shared/store';

type Props = {
  selectedChat: string;
};

export const MessagesList: React.FC<Props> = ({ selectedChat }) => {
  // const [messages, setMessages] = useState<Message[] | undefined>(undefined);

  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

  const { messages } = useSelector<RootState, ChatState>((state) => state.chat);

  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useDispatch();

  const { user } = useSelector<RootState, AuthState & ChatState>((state) => ({
    ...state.auth,
    ...state.chat,
  }));

  const chatContainer = useRef<HTMLElement>(null);

  const fetchMoreMessages = async () => {
    if (!chatContainer) return;

    if (loading) return;

    if (
      !(
        (chatContainer.current?.scrollHeight as number) >
        (chatContainer.current?.clientHeight as number)
      )
    )
      return;

    if (!messages) return;

    const lastElement =
      chatContainer.current?.firstElementChild?.firstElementChild?.lastElementChild
        ?.previousSibling;

    const newMessage = await loadMoreMessages(selectedChat, messages[messages.length - 1].doc);

    if (newMessage.length > 0) {
      dispatch(actions.addPrevMessages(newMessage));
      (lastElement as Element).scrollIntoView({
        behavior: 'auto',
      });
    } else {
      setHasMoreMessages(false);
    }
  };

  useEffect(() => {
    getUserMessages(selectedChat).then((res) => {
      dispatch(actions.setMessages(res));
      setLoading(false);
      setHasMoreMessages(true);
      chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
    });

    const observer = getNewMessage(selectedChat);

    const subscription = observer.onSnapshot((snapshot) => {
      var source = snapshot.metadata.hasPendingWrites ? 'Local' : 'Server';

      snapshot.docChanges().forEach((change) => {
        const message: Message = { ...(change.doc.data() as Message), doc: observer };

        if (change.type === 'added' && source === 'Server') {
          dispatch(actions.addMessage(message));

          chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
        }

        if (change.type === 'modified' && source === 'Server') {
          dispatch(actions.addMessage(message));

          chatContainer.current?.scrollTo(0, chatContainer.current.scrollHeight);
        }
        // if (change.type === 'removed') {

        // }
      });
    });

    return () => subscription();
  }, [selectedChat, dispatch]);

  return (
    <Box
      id={'chatContainer'}
      pr={'7px'}
      ref={chatContainer}
      height={'100%'}
      overflow="auto"
      sx={{
        position: 'relative',
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
      {!loading && messages.length === 0 && (
        <Flex alignItems={'center'} justifyContent={'center'} height={'100%'} width={'100%'}>
          <Text>There is still no messages here</Text>
        </Flex>
      )}

      {!loading && messages.length > 0 && (
        <InfiniteScroll
          dataLength={(messages as Message[]).length}
          next={fetchMoreMessages}
          style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
          inverse={true}
          hasMore={hasMoreMessages}
          loader={
            <Flex
              justifyContent="center"
              color={'primary'}
              sx={{ position: 'absolute', top: 0, left: '50%', right: '50%' }}
            >
              <Loader
                type="BallTriangle"
                color="#00BFFF"
                height={25}
                width={25}
                timeout={300} //3 secs
              />
            </Flex>
          }
          scrollableTarget={'chatContainer'}
        >
          {(messages as Message[]).map((message, i) => {
            const variant = message.author === user.uid ? 'myMessage' : 'message';
            return (
              <Box key={i} variant={variant} data={(message.doc as any).id}>
                <Text width={'100%'} sx={{ overflowWrap: 'break-word' }}>
                  {message.message}
                </Text>
              </Box>
            );
          })}
        </InfiniteScroll>
      )}
    </Box>
  );
};
