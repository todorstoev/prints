import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import { RouteComponentProps } from 'react-router-dom';

import { Input } from '@rebass/forms';
import { Box, Button, Heading, Text } from 'rebass';
import { Send } from 'react-feather';

import { AuthState, RoomData, Message, RootState, Device } from '../types';
import { addMessage, createNewChat, getUserRooms } from '../shared/services';

import firebase from '../shared/services/firebase';
import { MessagesList } from '../components/MessagesList';
import { ChatRoomDetails } from '../components/ChatRoomDetails';
import { actions } from '../shared/store';

const doesChatExists = (chats: RoomData[], deviceFromLocation: Device) =>
  chats.find((chat) => {
    return chat.data.users.some((id) => id === deviceFromLocation.id);
  });

const MessagesHub: React.FC<RouteComponentProps<any, any, Device>> = ({ location }) => {
  const [selectedChat, setSelectedChat] = useState<string>('');

  const [userRooms, setUserRooms] = useState<RoomData[]>([]);

  const [newChat, setNewChat] = useState<RoomData | undefined>();

  const [shoudStartNew, setShouldStartNew] = useState<boolean>(false);

  const [detailsDevice, setDetailsDevice] = useState<RoomData | undefined>();

  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  const dispatch = useDispatch();

  const { handleSubmit, register, reset } = useForm();

  const onSubmit = async (values: any) => {
    const newMessage: Message = {
      author: user.uid as string,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      message: values.message,
    };

    reset();

    if (shoudStartNew) await createNewChat(newChat as RoomData);

    await addMessage(newMessage, selectedChat);
  };

  useEffect(() => {
    getUserRooms(user).then((res) => {
      const { state: messagedDevice } = location;

      setUserRooms(res);

      if (messagedDevice !== undefined) {
        const chatExist = doesChatExists(res, messagedDevice);

        if (chatExist) {
          setSelectedChat(chatExist.id);
        } else {
          const startingNewChat: RoomData = {
            data: {
              recieverHasRed: false,
              title: `${messagedDevice.brand} ${messagedDevice.model}`,
              users: [user.uid as string, messagedDevice.id as string],
              voted: [],
              chatDevice: messagedDevice,
            },
            id: `${user.uid}:${messagedDevice.id}`,
          };

          setNewChat(startingNewChat);

          setSelectedChat(startingNewChat.id);

          setShouldStartNew(true);
        }
      } else {
        if (res[0]) setSelectedChat(res[0].id);
      }
    });
  }, [user, location]);

  useEffect(() => {
    if (userRooms) {
      setDetailsDevice(userRooms.find((room) => room.id === selectedChat));
    }
  }, [userRooms, selectedChat]);

  useEffect(() => {
    if (detailsDevice && detailsDevice.id === selectedChat) {
      if (detailsDevice?.data.voted.find((id) => id === user.uid)) {
        dispatch(actions.setCanVote(false));
      } else {
        dispatch(actions.setCanVote(true));
      }
    }

    if (newChat) {
      if (newChat.id === selectedChat) {
        dispatch(actions.setCanVote(false));
      }
    }
  }, [detailsDevice, dispatch, user.uid, newChat, selectedChat]);

  return (
    <Box p={'1rem'} pt={['5.5rem', '8rem']} height={'100%'}>
      {userRooms.length <= 0 && !location.state && (
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
        pb={[0, 3]}
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
          sx={{
            boxShadow: ['none', 'small'],
            gridArea: 'details',
          }}
          width={'100%'}
        >
          {(detailsDevice || newChat) && (
            <ChatRoomDetails
              {...{
                data: (detailsDevice as RoomData) || (newChat as RoomData),
              }}
            />
          )}
        </Box>
        {(userRooms.length > 0 || location.state) && (
          <Box
            p={2}
            overflow={'auto'}
            sx={{
              gridArea: 'chats',
              boxShadow: 'small',
              '@media screen and (max-width:56em)': {
                display: 'block',
                whiteSpace: 'nowrap',
              },
            }}
          >
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
                  variant={newChat.id === selectedChat ? 'chatItemActive' : 'chatItem'}
                  mr={2}
                  mt={[0, 2]}
                  onClick={() => {
                    const chatExists = userRooms.find((chat) => newChat === chat);

                    if (!chatExists) setShouldStartNew(true);

                    setSelectedChat(newChat.id);
                  }}
                >
                  {newChat.data.title}
                </Button>
              )}
              {userRooms.map((room) => {
                return (
                  <Button
                    variant={room.id === selectedChat ? 'chatItemActive' : 'chatItem'}
                    key={room.id}
                    mt={[0, 2]}
                    mr={2}
                    onClick={() => {
                      const chatExists = userRooms.find((chat) => room === chat);
                      if (chatExists) setShouldStartNew(false);
                      setSelectedChat(room.id);
                    }}
                  >
                    {room.data.title}
                    {room.id === user.uid ? '(yours)' : ''}
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}
        {(userRooms.length > 0 || location.state) && (
          <>
            <Box
              p={2}
              overflow={'hidden'}
              sx={{ gridArea: 'messages', boxShadow: ['none', 'small'] }}
            >
              {selectedChat && <MessagesList {...{ selectedChat }} />}
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
    </Box>
  );
};

export default MessagesHub;
