import firebase from '../services/firebase';

export const convertGeopoint = (lat: number, lng: number): firebase.firestore.GeoPoint => {
  const geoPoint = new firebase.firestore.GeoPoint(lat, lng);

  return geoPoint;
};
