import React, { ReactNode, useEffect } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

import MarkerClusterGroup from 'react-leaflet-markercluster';

import { Coords, MapState, RootState } from '../types';
import { actions } from '../shared/store';
import { convertGeopoint } from '../shared/helpers';

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

  const { isLoading } = useSelector<RootState, MapState>((state) => state.map);

  useEffect(() => {
    if (location.pathname === '/messages') return;

    map.whenReady(() => {
      const NORTH = convertGeopoint(map.getBounds().getNorth(), 0);

      const SOUTH = convertGeopoint(map.getBounds().getSouth(), 0);

      const bounds = { north: NORTH, south: SOUTH };

      dispatch(actions.changeMapBounds(bounds));
    });
  }, [map, dispatch, location.pathname]);

  useEffect(() => {
    if (location.pathname === '/messages') return;

    if (isLoading === true) {
      const NORTH = convertGeopoint(map.getBounds().getNorth(), 0);

      const SOUTH = convertGeopoint(map.getBounds().getSouth(), 0);

      const bounds = { north: NORTH, south: SOUTH };

      const zoom = map.getZoom();

      if (zoom < 10) {
        dispatch(actions.addNotification('In order to scan zoom in'));
      } else {
        batch(() => {
          dispatch(actions.changeMapBounds(bounds));
          dispatch(actions.addNotification('Scanned'));
        });
      }
    }
  }, [isLoading, map, dispatch, location.pathname]);

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
