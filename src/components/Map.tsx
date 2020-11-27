import React from 'react';

import { LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { Map as LeafletMap, TileLayer, ZoomControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Coords } from '../types';
import { throttle } from 'lodash';
import { on } from 'cluster';

type MapProps = {
  controls: boolean;
  center: Coords;
  zoom: number;
  dragging: boolean;
  onClick?: (e: LeafletMouseEvent) => void;
  onChangeBounds?: any;
};

const Map: React.FC<MapProps> = (props) => {
  const { center, zoom, onClick, children, controls, dragging, onChangeBounds } = props;

  return (
    <LeafletMap
      onmoveend={throttle(onChangeBounds, 2000, { leading: true, trailing: true })}
      style={{ height: '100%' }}
      center={{ lat: center.latitude, lng: center.longitude }}
      zoom={zoom}
      onclick={onClick}
      zoomControl={false}
      dragging={dragging}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />

      <MarkerClusterGroup>{children}</MarkerClusterGroup>

      {controls && <ZoomControl position={'bottomleft'} />}
    </LeafletMap>
  );
};

export default Map;
