import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Heading, Text } from 'rebass';

import { Icon } from 'leaflet';

import { Popup } from 'react-leaflet';

// import { filter as filterArray, isEmpty } from 'lodash';

import { AuthState, Device, DeviceState, MapState, RootState } from '../types';

import { getUserLocation } from '../shared/helpers';

import Map from '../components/Map';

import MapMarker from '../components/MapMarker';

import { actions } from '../shared/store';

type HomeProps = {};

const DeviceMarkerPopup: React.FC<Device> = (device) => {
  const { user, isAuthenticated } = useSelector<RootState, AuthState>((state) => state.auth);

  const { brand, model, type, materials } = device;

  return (
    <Popup>
      <Box>
        <Heading wrap={'true'}>
          {brand} {model}
        </Heading>
        <Box variant={'hr'} my={1}></Box>
        <Text>Type: {type}</Text>
        {materials && <Text>Materials: {materials.join(', ')}</Text>}
        {isAuthenticated && user.uid !== device.uid && (
          <Link to={{ pathname: '/messages', state: device }}>Message</Link>
        )}
        {!isAuthenticated && (
          <Box>
            To contact this device you have to <Link to={{ pathname: '/login' }}>Login</Link>
          </Box>
        )}
        {user.uid === device.uid && <Text>This device belongs to you</Text>}
      </Box>
    </Popup>
  );
};

export const Home: React.FC<HomeProps> = () => {
  const [uLocationRetrieved, setULocationRetrieved] = useState<boolean>(false);

  const [mapZoom] = useState<number>(13);

  const [dispalayDevices, setDisplayDevices] = useState<Device[] | null>(null);

  const { userLoc, allDevices, filteredDevices } = useSelector<RootState, MapState & DeviceState>(
    (state) => ({
      ...state.map,
      ...state.devices,
    }),
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!dispalayDevices) return;

    dispatch(
      actions.addNotification(
        `Found ${dispalayDevices.length} device${dispalayDevices.length === 1 ? '' : 's'}`,
      ),
    );
  }, [dispalayDevices, dispatch]);

  useEffect(() => {
    getUserLocation().then((location) => {
      dispatch(actions.changeUserLoc(location));
      setULocationRetrieved(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (!uLocationRetrieved) return;

    if (filteredDevices instanceof Array) {
      setDisplayDevices(filteredDevices);
    } else if (allDevices instanceof Array) {
      setDisplayDevices(allDevices);
    }
  }, [allDevices, filteredDevices, uLocationRetrieved]);

  const deviceIcon = new Icon({
    iconUrl: './assets/device-location-pin-icon.svg',
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [40, 40],
  });

  return (
    <Box height={'100%'}>
      {uLocationRetrieved && (
        <Map center={userLoc} zoom={mapZoom} controls={true} dragging={true}>
          {dispalayDevices &&
            dispalayDevices.map((marker, index) => {
              return (
                <MapMarker key={index} position={marker.coordinates} icon={deviceIcon}>
                  {marker && <DeviceMarkerPopup {...marker} />}
                </MapMarker>
              );
            })}
        </Map>
      )}
    </Box>
  );
};

export default Home;
