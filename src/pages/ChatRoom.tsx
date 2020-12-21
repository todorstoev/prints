import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { RouteComponentProps } from 'react-router-dom';

import { Input } from '@rebass/forms';
import { Box, Button, Flex, Heading, Text } from 'rebass';
import { Send } from 'react-feather';

import { AuthState, RoomData, Message, RootState, Device } from '../types';
import { addMessage, createNewChat, getUserRooms } from '../shared/services';

import firebase from '../shared/services/firebase';
import { MessagesList } from '../components/MessagesList';
import { ChatRoomDetails } from '../components/ChatRoomDetails';
import { Loader } from '../components/Loader';
import { animated, useTransition } from 'react-spring';
import { actions } from '../shared/store';

const doesChatExists = (chats: RoomData[], deviceFromLocation: Device) =>
  chats.find((chat) => {
    return chat.data.users.some((uid) => uid === deviceFromLocation.uid);
  });

const ChatRoom: React.FC<RouteComponentProps<any, any, Device>> = ({ location }) => {
  const [selectedChat, setSelectedChat] = useState<string>('');

  const [userRooms, setUserRooms] = useState<RoomData[] | undefined>(undefined);

  const [selectedUserRoom, setSelectedUserRoom] = useState<RoomData | undefined>();

  const [shoudStartNew, setShouldStartNew] = useState<boolean>(false);

  const [newChat, setNewChat] = useState<RoomData | undefined>();

  const { user } = useSelector<RootState, AuthState>((state) => ({
    ...state.auth,
  }));

  const dispatch = useDispatch();

  const { handleSubmit, register, reset } = useForm();

  const transitions = useTransition(typeof userRooms === 'undefined', null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const onSubmit = async (values: any) => {
    const newMessage: Message = {
      author: user.uid as string,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      message: values.message,
    };

    reset();

    if (shoudStartNew) {
      await createNewChat(newChat as RoomData);
      dispatch(actions.startWriting(true));
    }

    await addMessage(newMessage, selectedChat);
  };

  useEffect(() => {
    getUserRooms(user).then((res) => {
      const { state: messagedDevice } = location;

      setUserRooms(res);
      if (messagedDevice !== undefined) {
        const chatExist = doesChatExists(res, messagedDevice);
        if (chatExist) {
          setSelectedChat(chatExist.roomId);
        } else {
          const startingNewChat: RoomData = {
            data: {
              recieverHasRed: false,
              users: [user.uid as string, messagedDevice.uid as string],
              titles: [user.displayName, messagedDevice.uname],
              chatDevice: messagedDevice,
            },
            roomId: `${user.email}:${messagedDevice.uemail}`,
          };

          setNewChat(startingNewChat);

          setSelectedChat(startingNewChat.roomId);

          setShouldStartNew(true);
        }
      } else {
        if (res[0]) setSelectedChat(res[0].roomId);
      }
    });
  }, [user, location, dispatch]);

  useEffect(() => {
    if (userRooms) {
      setSelectedUserRoom(userRooms.find((room) => room.roomId === selectedChat));
    }
  }, [userRooms, selectedChat]);

  return (
    <Box p={'1rem'} pt={['5.5rem', '5rem']} height={'100%'} overflow={'hidden'}>
      {transitions.map(({ item, key, props }) =>
        item ? (
          <animated.div
            key={key}
            style={{
              ...props,
              position: 'absolute',
              width: '100%',
              top: '30%',
              alignItems: 'center',
            }}
          >
            <Flex justifyContent={'center'}>
              <Loader />
            </Flex>
          </animated.div>
        ) : (
          <animated.div key={key} style={{ ...props, width: '100%', height: '100%' }}>
            {(userRooms as RoomData[]).length <= 0 && !location.state && (
              <>
                <Heading as={'h2'} textAlign="center">
                  Nothing Here
                </Heading>
                <Text as={'h6'} textAlign="center">
                  (there are no active conversations)
                </Text>
              </>
            )}
            <Box
              sx={{
                height: '100%',
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '1fr 3fr',
                gridGap: '1em',
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateAreas: `
                      "details details"
                      "chats messages"
                      "inputHalf input"`,
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
                bg={['grayBg', 'transparent']}
                sx={{
                  boxShadow: ['small'],
                  gridArea: 'details',
                  borderRadius: '5px',
                }}
                p={[2, 0]}
                width={'100%'}
              >
                {(selectedUserRoom || newChat) && (
                  <ChatRoomDetails
                    {...{
                      data: (selectedUserRoom as RoomData) || (newChat as RoomData),
                    }}
                  />
                )}
              </Box>
              {((userRooms as RoomData[]).length > 0 || location.state) && (
                <Box
                  p={2}
                  overflow={'auto'}
                  bg={'grayBg'}
                  sx={{
                    gridArea: 'chats',
                    boxShadow: 'small',
                    borderRadius: '5px',
                    '@media screen and (max-width:56em)': {
                      display: 'block',
                      whiteSpace: 'nowrap',
                    },
                  }}
                >
                  {/* <Box variant="hr" /> */}
                  <Heading
                    color={'primary'}
                    fontWeight={['heading', 'body']}
                    display={['none', 'block']}
                  >
                    Chats
                  </Heading>

                  <Box height={[2, 5]}></Box>
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
                        variant={newChat.roomId === selectedChat ? 'chatItemActive' : 'chatItem'}
                        mr={2}
                        mt={[0, 2]}
                        width={['auto', 'auto', '100%']}
                        sx={{ textAlign: 'left' }}
                        onClick={() => {
                          const chatExists = (userRooms as RoomData[]).find(
                            (chat) => newChat === chat,
                          );

                          if (!chatExists) setShouldStartNew(true);

                          setSelectedChat(newChat.roomId);
                        }}
                      >
                        {newChat.data.titles.filter((devUser) => devUser !== user.displayName)[0]}
                      </Button>
                    )}
                    {(userRooms as RoomData[]).map((room) => {
                      return (
                        <Button
                          width={['auto', 'auto', '100%']}
                          sx={{ textAlign: 'left' }}
                          variant={room.roomId === selectedChat ? 'chatItemActive' : 'chatItem'}
                          key={room.roomId}
                          pl={1}
                          mt={[0, 2]}
                          mr={2}
                          onClick={() => {
                            const chatExists = (userRooms as RoomData[]).find(
                              (chat) => room === chat,
                            );
                            if (chatExists) setShouldStartNew(false);
                            setSelectedChat(room.roomId);
                          }}
                        >
                          {room.data.titles.filter((devUser) => devUser !== user.displayName)[0]}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              )}
              {((userRooms as RoomData[]).length > 0 || location.state) && (
                <>
                  <Box
                    bg={'grayBg'}
                    p={2}
                    overflow={'hidden'}
                    sx={{ gridArea: 'messages', boxShadow: ['small'], borderRadius: '5px' }}
                  >
                    {selectedChat && (
                      <MessagesList
                        {...{
                          selectedChat,
                        }}
                      />
                    )}
                  </Box>
                  <Box sx={{ gridArea: 'inputHalf' }} display={['none', 'block']}></Box>
                  <Box sx={{ gridArea: 'input' }}>
                    <form onSubmit={handleSubmit(onSubmit)} style={{ position: 'relative' }}>
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
            </Box>
          </animated.div>
        ),
      )}
    </Box>
  );
};

export default ChatRoom;
