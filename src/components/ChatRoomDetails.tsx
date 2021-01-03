import { useTheme } from 'emotion-theming';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Flex, Heading, Text } from 'rebass';
import { Icon } from 'leaflet';
import { animated, useSpring, config } from 'react-spring';

import { AuthState, RoomData, RootState } from '../types';

import { ChatDetailsControls } from '../components/ChatDetailsControls';
import MapMarker from '../components/MapMarker';
import { MapContainer, TileLayer } from 'react-leaflet';
import firebase from 'firebase';

type Props = {
  data: RoomData;
};

export const ChatRoomDetails: React.FC<Props> = ({ data }) => {
  const mainTheme = useTheme<any>();

  const [stretched, setStretched] = useState<boolean>(true);

  const props = useSpring({ height: stretched ? '100px' : '0px', config: config.default });

  const { user } = useSelector<RootState, AuthState>((state) => ({
    ...state.auth,
  }));

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
      p={[0, 2]}
      height={'auto'}
    >
      {data && (
        <Box width={'100%'} height={'100%'}>
          <Flex justifyContent={'space-between'}>
            <Heading color={['primary', 'background']}>
              {data.data.chatDevice.brand} {data.data.chatDevice.model}
            </Heading>
            <ChatDetailsControls
              device={data.data.chatDevice}
              streched={stretched}
              setStretched={setStretched}
            />
          </Flex>

          <animated.div style={props}>
            <Box
              sx={{
                display: 'grid',
                gridGap: 3,
                height: '100%',
                overflow: 'hidden',
                gridTemplateColumns: 'auto minmax(auto,250px)',
                '@media screen and (max-width:56em)': {
                  gridTemplateColumns: 'calc(100% - 100px) repeat(auto-fill,100px)',
                  gridGap: 0,
                },
              }}
            >
              <Flex flexDirection={'column'} justifyContent={'space-evenly'}>
                <Text color={['primary', 'background']} fontSize={[1, 2]}>
                  Type : {data.data.chatDevice.type}
                </Text>
                {data.data.chatDevice.materials && (
                  <Text color={['primary', 'background']} fontSize={[1, 2]}>
                    Materials: {data.data.chatDevice.materials.join(', ')}
                  </Text>
                )}
                <Box>
                  <Text color={['primary', 'background']} fontSize={[1, 2]}>
                    Dimensions: {data.data.chatDevice.dimensions.height}/
                    {data.data.chatDevice.dimensions.width}/{data.data.chatDevice.dimensions.depth}
                  </Text>
                </Box>
                {data.data.chatDevice.uid === user.uid && (
                  <Box>
                    <Text color={['primary', 'background']} fontSize={[1, 2]}>
                      (This device is yours)
                    </Text>
                  </Box>
                )}
              </Flex>

              <Box
                sx={{
                  borderRadius: '5px',
                  overflow: 'hidden',
                }}
              >
                {data.data.chatDevice.location instanceof firebase.firestore.GeoPoint && (
                  <MapContainer
                    style={{ height: '100%' }}
                    center={{
                      lat: data.data.chatDevice.location.latitude,
                      lng: data.data.chatDevice.location.longitude,
                    }}
                    zoom={13}
                    zoomControl={false}
                    dragging={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapMarker
                      position={data.data.chatDevice.location}
                      icon={deviceIcon}
                    ></MapMarker>

                    {/* {controls && <ZoomControl position={'bottomleft'} />} */}
                  </MapContainer>
                )}
              </Box>
            </Box>
          </animated.div>
        </Box>
      )}
    </Flex>
  );
};
