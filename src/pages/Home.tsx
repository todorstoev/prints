import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Box, Heading, Text } from 'rebass';

import { Icon } from 'leaflet';

import { Popup } from 'react-leaflet';

import { filter as filterArray, isEmpty } from 'lodash';

import { AuthState, Device, IMapFilter, MapState, RootState } from '../types';
import { convertGeopoint, getUserLocation } from '../shared/helpers';

import Map from '../components/Map';

import MapMarker from '../components/MapMarker';
import { actions } from '../shared/store';
import { loadDevicesService } from '../shared/services';

type HomeProps = {};

const filterDevices = async (filter: IMapFilter, mapMarkers: Device[], dispatch: any) => {
  let mappedFilter: any = {};

  if (filter && filter.brand.length > 0) mappedFilter.brand = filter.brand;

  if (filter && filter.model.length > 0) mappedFilter.model = filter.model;

  if (filter && typeof filter.type !== 'undefined' && typeof filter.type !== 'string')
    mappedFilter.type = filter.type.value;

  if (isEmpty(mappedFilter)) {
    dispatch(actions.addNotification(`No filters selected`));
    return;
  }

  const filtered: Device[] = filterArray(mapMarkers, mappedFilter);

  return filtered;
};

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

  const [mapMarkers, setMapMarkers] = useState<Device[]>([]);

  const { userLoc, bounds, filter } = useSelector<RootState, MapState>((state) => state.map);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserLocation().then((location) => {
      dispatch(actions.changeUserLoc(location));
      setULocationRetrieved(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (
      JSON.stringify(bounds.north) !== JSON.stringify(convertGeopoint(0, 0)) &&
      JSON.stringify(bounds.south) !== JSON.stringify(convertGeopoint(0, 0))
    ) {
      loadDevicesService({ northBound: bounds.north, southBound: bounds.south })
        .then((res) => {
          return res;
        })
        .then((res) => {
          if (!filter) {
            setMapMarkers(res);
            throw new Error('set');
          } else {
            return filterDevices(filter, res, dispatch);
          }
        })
        .then((res) => {
          if (res) {
            setMapMarkers(res);
            dispatch(
              actions.addNotification(`${res.length} device${res.length === 1 ? '' : 's'} found`),
            );
          }
        })
        .catch((e) => {});
    }
  }, [filter, bounds, dispatch]);

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
          {mapMarkers.map((marker, index) => {
            return (
              <MapMarker key={index} position={marker.location} icon={deviceIcon}>
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
