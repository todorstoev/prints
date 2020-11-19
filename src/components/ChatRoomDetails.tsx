import { useTheme } from 'emotion-theming';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex, Text, Heading, Button } from 'rebass';
import { Plus, Minus } from 'react-feather';

import { AuthState, ChatState, RoomData, RootState } from '../types';

import { actions } from '../shared/store';

import { ChatDetailsControls } from '../components/ChatDetailsControls';
import MapMarker from '../components/MapMarker';
import Map from '../components/Map';
import { Icon } from 'leaflet';

export enum Vote {
  Up = 'UP',
  Down = 'DOWN',
}

type Props = {
  data: RoomData;
};

export const ChatRoomDetails: React.FC<Props> = ({ data }) => {
  const mainTheme = useTheme<any>();

  const [stretched, setStretched] = useState<boolean>(true);

  const dispatch = useDispatch();

  const { user, canVote } = useSelector<RootState, AuthState & ChatState>((state) => ({
    ...state.auth,
    ...state.chat,
  }));

  const headingRef = useRef<HTMLElement>(null);

  const deviceIcon = new Icon({
    iconUrl: './assets/device-location-pin-icon.svg',
    iconAnchor: [15, 30],
    popupAnchor: [0, 0],
    iconSize: [30, 30],
  });

  return (
    <Flex
      bg={[mainTheme.bwGradientSmall, mainTheme.bwGradient]}
      sx={{
        borderRadius: 5,
        position: 'relative',
      }}
      flexDirection={'column'}
      color={'background'}
      p={[0, 3]}
      height={'auto'}
    >
      {data &&
        (!stretched ? (
          <Box width={'100%'} height={'100%'}>
            <Box>
              <ChatDetailsControls
                device={data.data.chatDevice}
                streched={stretched}
                setStretched={setStretched}
              />
            </Box>

            <Box
              mt={2}
              sx={{
                display: 'grid',
                gridGap: 3,
                height: '100%',
                gridTemplateColumns: 'auto 1fr',
                '@media screen and (max-width:56em)': {
                  gridTemplateColumns: ' repeat(1, 1fr)',
                  gridGap: 0,
                },
              }}
            >
              <Flex
                height={'100%'}
                justifyContent={['space-between', 'space-between', 'flex-start']}
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
                    dragging={false}
                    zoom={13}
                    center={data.data.chatDevice.location}
                    controls={false}
                  >
                    <MapMarker
                      position={data.data.chatDevice.location}
                      icon={deviceIcon}
                    ></MapMarker>
                  </Map>
                </Box>
                <Flex pl={3} flexDirection={'column'} justifyContent={'flex-end'}>
                  <Text color={['primary', 'background']} fontSize={[1, 2]}>
                    Type : {data.data.chatDevice.type}
                  </Text>
                  <Text color={['primary', 'background']} fontSize={[1, 2]}>
                    Materials: {data.data.chatDevice.materials.join(', ')}
                  </Text>
                  <Box>
                    <Text color={['primary', 'background']} fontSize={[1, 2]}>
                      Dimensions: {data.data.chatDevice.dimensions.height}/
                      {data.data.chatDevice.dimensions.width}/
                      {data.data.chatDevice.dimensions.depth}
                    </Text>
                  </Box>
                  {data.data.chatDevice.id === user.uid && (
                    <Box>
                      <Text color={['primary', 'background']} fontSize={[1, 2]}>
                        (This device is yours)
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Box mt={2}>
                <Flex
                  alignItems={['center', 'center', 'flex-end']}
                  height={'100%'}
                  flexDirection={['row', 'column']}
                  justifyContent={['space-between', 'space-evenly']}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Heading
                      color="primary"
                      my={2}
                      py={1}
                      ref={headingRef}
                      fontSize={[2, 3]}
                      fontWeight={'body'}
                    >
                      Rating : {data.data.rating[user.uid as string]}
                    </Heading>
                  </Box>

                  <Box>
                    <Button
                      mr={1}
                      disabled={!canVote}
                      onClick={() => {
                        if (!canVote) return;
                        dispatch(
                          actions.voteUserRequest({
                            vote: Vote.Down,
                            roomData: data,
                          }),
                        );

                        (data.data.rating[user.uid as string] as number)--;
                      }}
                    >
                      <Minus />
                    </Button>
                    <Button
                      disabled={!canVote}
                      onClick={() => {
                        if (!canVote) return;
                        dispatch(
                          actions.voteUserRequest({
                            vote: Vote.Up,
                            roomData: data,
                          }),
                        );

                        (data.data.rating[user.uid as string] as number)++;
                      }}
                    >
                      <Plus />
                    </Button>
                  </Box>
                </Flex>
              </Box>
            </Box>
          </Box>
        ) : (
          <ChatDetailsControls
            device={data.data.chatDevice}
            streched={stretched}
            setStretched={setStretched}
          />
        ))}
    </Flex>
  );
};
