import { useTheme } from 'emotion-theming';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Flex, Text, Heading, Button } from 'rebass';
import { ChevronDown, ChevronUp, Plus, Minus, Info } from 'react-feather';
import { useSpring, animated, config } from 'react-spring';

import MapMarker from '../components/MapMarker';
import Map from '../components/Map';
import { AuthState, ChatState, RoomData, RootState } from '../types';

import { actions } from '../shared/store';

export enum Vote {
  Up = 'UP',
  Down = 'DOWN',
}

type Props = {
  data: RoomData;
};

export const ChatRoomDetails: React.FC<Props> = ({ data }) => {
  const mainTheme = useTheme<any>();

  const dispatch = useDispatch();

  const [stretched, setStretched] = useState<boolean>(true);

  const [showInfo, setShowInfo] = useState<boolean>(false);

  const { user, canVote } = useSelector<RootState, AuthState & ChatState>((state) => ({
    ...state.auth,
    ...state.chat,
  }));

  const headingRef = useRef<HTMLElement>(null);

  const [props, set] = useSpring(() => ({
    opacity: 1,
    transform: `translate3d(0,0px,0) scale(0.7)`,
  }));

  useEffect(() => {
    set({
      opacity: showInfo ? 1 : 0,
      transform: `translate3d(0,${showInfo ? -100 : 0}px,0) scale(${showInfo ? 1 : 0.6})`,
      config: config.stiff,
    });
  }, [showInfo, set]);

  return (
    <Flex
      bg={[mainTheme.bwGradientSmall, mainTheme.bwGradient]}
      sx={{
        borderRadius: 5,
        position: 'relative',
      }}
      color={'background'}
      p={[0, 3]}
      height={'auto'}
    >
      <Box color={'primary'} sx={{ position: 'absolute', right: 0, top: 0 }}>
        {stretched && (
          <ChevronDown onClick={() => setStretched(false)} style={{ cursor: 'pointer' }} />
        )}
        {!stretched && (
          <ChevronUp onClick={() => setStretched(true)} style={{ cursor: 'pointer' }} />
        )}
      </Box>
      {data &&
        (!stretched ? (
          <Box width={'100%'} height={'100%'}>
            <Box
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
                    <MapMarker position={data.data.chatDevice.location}></MapMarker>
                  </Map>
                </Box>
                <Flex pl={3} flexDirection={'column'} justifyContent={'space-evenly'}>
                  <Heading color={['primary', 'background']}>
                    {data.data.chatDevice.brand} {data.data.chatDevice.model}
                  </Heading>
                  <Text color={['primary', 'background']}>Type : {data.data.chatDevice.type}</Text>
                  <Text color={['primary', 'background']}>
                    Materials: {data.data.chatDevice.materials.join(', ')}
                  </Text>
                  <Box>
                    <Text color={['primary', 'background']}>
                      Dimensions: {data.data.chatDevice.dimensions.height} /{' '}
                      {data.data.chatDevice.dimensions.width} /{' '}
                      {data.data.chatDevice.dimensions.depth}
                    </Text>
                  </Box>
                  {data.data.chatDevice.id === user.uid && (
                    <Box>
                      <Text color={['primary', 'background']}>(This device is yours)</Text>
                    </Box>
                  )}
                </Flex>
              </Flex>
              <Box>
                <Box mt={2} />
                <Flex
                  alignItems={['center', 'center', 'flex-end']}
                  height={'100%'}
                  flexDirection={'column'}
                  justifyContent={'space-evenly'}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Heading color="primary" my={2} py={1} ref={headingRef}>
                      Rating : {data.data.chatDevice.rating}
                    </Heading>
                    <Box
                      sx={{
                        ':hover': {
                          color: 'secondary',
                          cursor: 'pointer',
                        },
                        transition: 'all 0.2s linear',
                        position: 'absolute',
                        left: 0,
                        top: `-5px`,
                      }}
                      color="primary"
                      onClick={(e) => {
                        setShowInfo(!showInfo);
                      }}
                    >
                      <Info size={14} />
                    </Box>
                  </Box>

                  <animated.div style={{ ...props, position: 'absolute', zIndex: 1000 }}>
                    <Box
                      p={2}
                      bg={'background'}
                      color={'black'}
                      sx={{ boxShadow: 'card', maxWidth: 240 }}
                    >
                      You can rate this device's owner. {'\n'} Careful, you can rate only once.
                    </Box>
                  </animated.div>
                  {data.data.chatDevice.id !== user.uid && (
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
                          (data.data.chatDevice.rating as number)--;
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
                          (data.data.chatDevice.rating as number)++;
                        }}
                      >
                        <Plus />
                      </Button>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Box>
          </Box>
        ) : (
          <Heading color={['primary', 'background']}>
            {data.data.chatDevice.brand} {data.data.chatDevice.model}
          </Heading>
        ))}
    </Flex>
  );
};
