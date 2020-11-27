import { Coords } from '../../types';
import { convertGeopoint } from './convertGeopoint';

const getLocationByIpAddress = (): Promise<Coords> => {
  return new Promise<Coords>((resolve) => {
    fetch('https://ipapi.co/json')
      .then((res) => res.json())
      .then((location) => resolve(convertGeopoint(location.latitude, location.longitude)));
  });
};

export const getUserLocation = (): Promise<Coords> => {
  return new Promise<Coords>((resolve) =>
    navigator.geolocation.getCurrentPosition(
      (location) => resolve(convertGeopoint(location.coords.latitude, location.coords.longitude)),
      () => resolve(getLocationByIpAddress()),
    ),
  );
};
