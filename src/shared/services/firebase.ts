import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/messaging';
import * as geofirestore from 'geofirestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSEGINID,
  appId: process.env.REACT_APP_APPID,
  measurementId: process.env.REACT_APP_MEASUREID,
};

export default firebase;

export const myFirebase = firebase.initializeApp(firebaseConfig);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();

export const localPersistance = firebase.auth.Auth.Persistence.LOCAL;
export const nonePersistance = firebase.auth.Auth.Persistence.SESSION;

const baseDb = myFirebase.firestore();

if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging();

  messaging
    .getToken({ vapidKey: process.env.REACT_APP_WEBPUSH })
    .then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        console.log('Token valid');
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
  });
}

Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    // TODO(developer): Retrieve a registration token for use with FCM.
    // ...
  } else {
    console.log('Unable to get permission to notify.');
  }
});

export const GeoFirestore = geofirestore.initializeApp(baseDb as any);

export const db = baseDb;
