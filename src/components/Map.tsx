import React, { ReactNode } from 'react';

import { LeafletMouseEvent } from 'leaflet';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Coords } from '../types';

type MapProps = {
  controls: boolean;
  center: Coords;
  zoom: number;
  dragging: boolean;
  onClick?: (e: LeafletMouseEvent) => void;
};

type PropsWithChildren<P> = P & { children?: ReactNode };

const Map = React.forwardRef<any, PropsWithChildren<MapProps>>((props, ref) => {
  const { center, zoom, onClick, dragging, children } = props;

  return (
    <LeafletMap
      style={{ height: '100%' }}
      center={{ lat: center.latitude, lng: center.longitude }}
      zoom={zoom}
      onclick={onClick}
      zoomControl={false}
      dragging={dragging}
      ref={ref}
      // {...(onChangeBounds
      //   ? { onmoveend: throttle(onChangeBounds, 3000, { leading: true, trailing: true }) }
      //   : {})}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />

      <MarkerClusterGroup>{children}</MarkerClusterGroup>

      {/* {controls && <ZoomControl position={'bottomleft'} />} */}
    </LeafletMap>
  );
});

export default Map;
