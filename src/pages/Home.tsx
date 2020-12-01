import React from 'react';
import { useSelector } from 'react-redux';

import { Icon } from 'leaflet';
import { Popup, Map as LeafletMap } from 'react-leaflet';

import { Box, Heading, Text } from 'rebass';

import { Link } from 'react-router-dom';

import { Coords, Device, PrintsUser, RootState } from '../types';
import { convertGeopoint, getUserLocation } from '../shared/helpers';

import { loadDevicesService } from '../shared/services';

import Map from '../components/Map';

import MapMarker from '../components/MapMarker';

type HomeProps = {};

type HomeState = {
  mapCenter: Coords;
  mapZoom: number;
  mapMarkers: Device[];
};

const DeviceMarkerPopup: React.FC<Device> = (device) => {
  const user = useSelector<RootState, PrintsUser>((state) => state.auth.user);

  const { brand, model, type, materials } = device;

  return (
    <Popup>
      <Box>
        <Heading wrap={'true'}>
          {brand} {model}
        </Heading>
        <Box variant={'hr'} my={1}></Box>
        <Text>Type: {type}</Text>
        <Text>Materials: {materials.join(', ')}</Text>
        {user.uid !== device.uid && (
          <Link to={{ pathname: '/messages', state: device }}>Message</Link>
        )}
        {user.uid === device.uid && <Text>This device belongs to you</Text>}
      </Box>
    </Popup>
  );
};

export class Home extends React.Component<HomeProps, HomeState> {
  private mounted: boolean = false;
  private mapRef = React.createRef<LeafletMap>();

  readonly state: HomeState = {
    mapCenter: convertGeopoint(0, 0),
    mapZoom: 13,
    mapMarkers: [],
  };

  componentDidMount() {
    this.mounted = true;

    getUserLocation().then((location) => {
      if (this.mounted) this.setState({ mapCenter: location });
    });

    if (this.mapRef.current) {
      var NORTH = convertGeopoint(this.mapRef?.current?.leafletElement.getBounds().getNorth(), 0);

      var SOUTH = convertGeopoint(this.mapRef?.current?.leafletElement.getBounds().getSouth(), 0);

      loadDevicesService({ northBound: NORTH, southBound: SOUTH }).then((devices) => {
        console.log(devices);
        if (this.mounted) this.setState({ mapMarkers: devices });
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { mapCenter, mapZoom, mapMarkers } = this.state;

    const deviceIcon = new Icon({
      iconUrl: './assets/device-location-pin-icon.svg',
      iconAnchor: [20, 40],
      popupAnchor: [0, -35],
      iconSize: [40, 40],
    });

    return (
      <Box height={'100%'}>
        <Map center={mapCenter} zoom={mapZoom} controls={true} dragging={true} ref={this.mapRef}>
          {mapMarkers.map((marker, index) => {
            return (
              <MapMarker key={index} position={marker.location} icon={deviceIcon}>
                {marker && <DeviceMarkerPopup {...marker} />}
              </MapMarker>
            );
          })}
        </Map>
      </Box>
    );
  }
}

export default Home;
