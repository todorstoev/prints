import { RoomData, Device, Printer, PrintsUser, ChatData, Message } from '../../types';
import { db, googleProvider, myFirebase, localPersistance, nonePersistance } from './firebase';
import { FirebaseError, User } from 'firebase';
import { Observable } from 'rxjs';

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  NumberDictionary,
  starWars,
} from 'unique-names-generator';

import { fbErrorMessages, remapUser } from '../helpers';

const numberDictionary = NumberDictionary.generate({ min: 0, max: 9999 });

const customConfigNameGen: Config = {
  dictionaries: [adjectives, starWars, numberDictionary],
  separator: '-',
  length: 3,
};

export const registerWithEmail = async (email: string, password: string): Promise<PrintsUser> => {
  const username: string = uniqueNamesGenerator(customConfigNameGen)
    .replaceAll(' ', '-')
    .toLowerCase();

  return new Promise((resolve, reject) => {
    const userToInsert: PrintsUser = {
      email,
      firstName: '',
      lastName: '',
      uid: '',
      username,
      rating: 100,
      pic: './assets/user-unknown-com.svg',
      devices: [],
    };

    myFirebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        userToInsert.uid = res.user?.uid;

        return saveUserToDb(userToInsert);
      })
      .then((res) => {
        if (res) resolve(userToInsert);
      })
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const loginWithGoogleStart = (): boolean => {
  sessionStorage.setItem('3dreact:sso', 'logging');
  myFirebase.auth().signInWithRedirect(googleProvider);

  return true;
};

export const loginWithSsoFinish = (): Promise<PrintsUser> => {
  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .getRedirectResult()
      .then((res) => {
        const username: string = uniqueNamesGenerator(customConfigNameGen)
          .replace(' ', '-')
          .toLowerCase();

        const userToInsert = remapUser(res, username);

        if (res.additionalUserInfo?.isNewUser) {
          return saveUserToDb(userToInsert);
        } else {
          return getUserFromDb(res.user?.uid as string);
        }
      })
      .then((user) => resolve(user as PrintsUser))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const loginWithEmail = (
  email: string,
  password: string,
  remember: boolean,
): Promise<PrintsUser> => {
  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .setPersistence(remember ? localPersistance : nonePersistance)
      .then(() => myFirebase.auth().signInWithEmailAndPassword(email, password))
      .then((res) => {
        const uid = (res.user as User).uid;

        return getUserFromDb(uid);
      })
      .then((res) => {
        resolve(res);
      })
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const getCurrentUser = (): Observable<firebase.User> => {
  return new Observable((subscriber) => {
    myFirebase.auth().onAuthStateChanged({
      next: (user) => {
        subscriber.next(user);
      },
      error: (error) => subscriber.error(error.message),
      complete: () => subscriber.complete(),
    });
  });
};

export const logoutUser = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .signOut()
      .then(() => {
        resolve(true);
      })
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const getDevicesService = (): Promise<Device[]> => {
  return new Promise<Device[]>((resolve, reject) => {
    db.collection('users')
      .get()
      .then((asyncSnapshot) => {
        let devicesList: Device[] = [];

        for (let i = 0; asyncSnapshot.docs.length > i; i++) {
          const currUserDevices: Device[] = asyncSnapshot.docs[i].data().devices;

          if (currUserDevices.length < 1) continue;

          for (let d = 0; currUserDevices.length > d; d++) {
            currUserDevices[d].id = asyncSnapshot.docs[i].data().uid;
            currUserDevices[d].rating = asyncSnapshot.docs[i].data().rating;
            currUserDevices[d].username = asyncSnapshot.docs[i].data().username;
          }

          devicesList = [...devicesList, ...currUserDevices];
        }

        resolve(devicesList);
      })
      .catch((e) => reject(e));
  });
};

export const getPrinters = (): Promise<Printer[]> => {
  return new Promise<Printer[]>((resolve, reject) => {
    db.collection('printers').onSnapshot((snapshot) => {
      const printers = snapshot.docs.map((doc) => doc.data() as Printer);

      resolve(printers);
    });
  });
};

export const saveUserToDb = (user: PrintsUser): Promise<PrintsUser | FirebaseError> => {
  return new Promise((resolve, reject) => {
    db.collection('users')
      .add(user)
      .then((_snapshot) => {
        resolve(user);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const getUserFromDb = (uid: string): Promise<any> => {
  return new Promise((resolve) => {
    db.collection('users')
      .where('uid', '==', uid)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          resolve(doc.data());
        });
      })
      .catch((e) => {
        throw e;
      });
  });
};

export const updatePrintsUserDB = (user: PrintsUser): Promise<PrintsUser> => {
  return new Promise((resolve, reject) => {
    db.collection('users')
      .where('uid', '==', user.uid)
      .get()
      .then((docs) => {
        const [doc] = docs.docs;
        return doc.ref.update(user);
      })
      .then(() => {
        resolve(user);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const updateUser = (user: PrintsUser, newData: any): Promise<PrintsUser> => {
  const updatedUser = {
    ...user,
    email: newData.email,
    firstName: newData.firstName,
    lastName: newData.lastName,
    username: newData.username,
  };

  if (newData.email === user.email) return updatePrintsUserDB(updatedUser);

  return new Promise((resolve, reject) => {
    updateEmail(newData.email)
      .then(() => {
        return updatePrintsUserDB(user);
      })
      .then(() => resolve(user))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const updateEmail = (email: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .currentUser?.updateEmail(email)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const getUserMessages = (selected: string): Observable<Message[]> => {
  const doc = db
    .collection('chats')
    .doc(selected)
    .collection('messages')
    .orderBy('time', 'asc')
    .limitToLast(15);

  return new Observable((subscriber) => {
    doc.onSnapshot({
      next: (snapshot) =>
        subscriber.next(
          snapshot.docs.map((doc) => {
            return doc.data() as Message;
          }),
        ),
      error: (error) => subscriber.error(error.message),
      complete: () => subscriber.complete(),
    });
  });
};

export const voteUser = (uid: string, rating: number): Promise<boolean> => {
  return new Promise((resolve, rejects) => {
    db.collection('users')
      .where('uid', '==', uid)
      .get()
      .then((docs) => {
        const [doc] = docs.docs;

        return doc.ref.update({ rating });
      })
      .then(() => resolve(true))
      .catch((err) => rejects(fbErrorMessages(err)));
  });
};

export const getUserRooms = (user: PrintsUser): Promise<RoomData[]> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .where('users', 'array-contains', user.uid)

      .get()
      .then((querySnapshot) => {
        const docs: RoomData[] = [];
        querySnapshot.forEach((doc) => docs.push({ roomId: doc.id, data: doc.data() as ChatData }));

        resolve(docs);
      })
      .catch((e) => reject(e));
  });
};

export const updateUserRoom = (room: RoomData): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .doc(room.roomId)
      .update(room.data)
      .then((res) => resolve(true))
      .catch((err) => reject(err));
  });
};

export const createNewChat = (newChat: RoomData): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .doc(newChat.roomId)
      .set(newChat.data)
      .then((res) => resolve(true))
      .catch((e) => reject(e));
  });
};

export const addMessage = (message: Message, selected: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .doc(selected)
      .collection('messages')
      .add(message)
      .then(() => resolve(true))
      .catch((err) => reject(err));
  });
};
