import React from 'react';

import { Icon, LeafletMouseEvent } from 'leaflet';

import { Marker, useMapEvents } from 'react-leaflet';

import { Coords } from '../types';

type MapMarkerProps = {
  position: Coords;
  icon?: Icon;
  onClick?: (e: LeafletMouseEvent) => void | undefined;
};

const MapMarker: React.FC<MapMarkerProps> = ({ position, icon, children, onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick && onClick(e);
    },
  });

  const defaultIcon = new Icon({
    iconUrl: './assets/default-location-pin-icon.svg',
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [45, 45],
  });

  return (
    <Marker
      position={{ lat: position.latitude, lng: position.longitude }}
      icon={icon || defaultIcon}
      zIndexOffset={9999}
    >
      {children}
    </Marker>
  );
};

export default MapMarker;
