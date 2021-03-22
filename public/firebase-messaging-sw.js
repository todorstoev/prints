// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.10/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

firebase.initializeApp({
  apiKey: 'AIzaSyBUt37RNTC2X4qhEkWI9sSbH7ApR2KEszM',
  authDomain: '3dreact.com',
  databaseURL: 'https://dreact-4188b.firebaseio.com',
  projectId: 'dreact-4188b',
  storageBucket: 'dreact-4188b.appspot.com',
  messagingSenderId: 'sender-id',
  appId: '1:547815518327:web:ed6153323fe73c2d33d672',
  measurementId: 'G-measurement-id',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = 'Background Message Title';
//   const notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png',
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
