import React from 'react';

import { Icon } from 'leaflet';
import { Marker } from 'react-leaflet';

import { Coords } from '../types';

type MapMarkerProps = {
  position: Coords;
  icon?: Icon;
};

const MapMarker: React.FC<MapMarkerProps> = (props) => {
  const { position, icon, children } = props;

  const defaultIcon = new Icon({
    iconUrl: './assets/default-location-pin-icon.svg',
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [45, 45],
  });

  return (
    <Marker position={position} icon={icon || defaultIcon}>
      {children}
    </Marker>
  );
};

export default MapMarker;
