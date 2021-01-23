import React, { ReactNode, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { throttle } from 'lodash';
import L from 'leaflet';

import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Coords } from '../types';
import { convertGeopoint } from '../shared/helpers';
import { actions } from '../shared/store';

type MapProps = {
  controls: boolean;
  center: Coords;
  zoom: number;
  dragging: boolean;
};

type PropsWithChildren<P> = P & { children?: ReactNode };

const MapUser: React.FC = () => {
  const map = useMap();

  const dispatch = useDispatch();

  const location = useLocation();

  // eslint-disable-next-line
  const dragHandler = useCallback(
    throttle(
      (e: L.DragEndEvent) => {
        const { target } = e;
      
        // if (e.distance > 200)
        dispatch(
          actions.setCenter(convertGeopoint(target.getCenter().lat, target.getCenter().lng)),
        );
      },
      2000,
      {
        trailing: false,
      },
    ),
    [dispatch],
  );

  useEffect(() => {
    if (location.pathname !== '/') return;

    map.on('dragend', dragHandler);

    return () => {
      map.off('dragend', dragHandler);
    };
  }, [map, dispatch, location.pathname, dragHandler]);

  return null;
};

const createClusterCustomIcon = (cluster: any) =>
  L.divIcon({
    html: `<div>${cluster.getChildCount()}<div>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(35, 35, true),
  });

const Map: React.FC<PropsWithChildren<MapProps>> = ({ center, zoom, dragging, children }) => {
  return (
    <MapContainer
      style={{ height: '100%' }}
      center={{ lat: center.latitude, lng: center.longitude }}
      zoom={zoom}
      zoomControl={false}
      dragging={dragging}
    >
      <MapUser />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        spiderfyDistanceMultiplier={4}
        removeOutsideVisibleBounds={true}
        zoomToBoundsOnClick={true}
        iconCreateFunction={createClusterCustomIcon}
      >
        {children}
      </MarkerClusterGroup>

      {/* {controls && <ZoomControl position={'bottomleft'} />} */}
    </MapContainer>
  );
};

export default Map;
