import React, { useRef } from 'react';

import { Icon, LeafletMouseEvent } from 'leaflet';
import { Marker } from 'react-leaflet';

import { Coords } from '../types';

type MapMarkerProps = {
  position: Coords;
  icon?: Icon;
};

const MapMarker: React.FC<MapMarkerProps> = (props) => {
  const { position, icon, children } = props;

  const markerRef = useRef<Marker>(null);

  const defaultIcon = new Icon({
    iconUrl: './assets/default-location-pin-icon.svg',
    iconAnchor: [20, 40],
    popupAnchor: [0, -35],
    iconSize: [45, 45],
  });

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon || defaultIcon}
      zIndexOffset={9999}
      onclick={(e: LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        markerRef.current?.leafletElement.openPopup();
      }}
    >
      {children}
    </Marker>
  );
};

export default MapMarker;
