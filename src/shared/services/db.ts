import { RoomData, Device, Printer, PrintsUser, ChatData, Message } from '../../types';

import {
  db,
  googleProvider,
  facebookProvider,
  myFirebase,
  localPersistance,
  nonePersistance,
  GeoFirestore,
} from './firebase';
import { Observable } from 'rxjs';
import { cloneDeepWith } from 'lodash';

import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  NumberDictionary,
  starWars,
} from 'unique-names-generator';

import { fbErrorMessages, remapUser } from '../helpers';

export enum ProviderSSO {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
}

const numberDictionary = NumberDictionary.generate({ min: 0, max: 9999 });

const customConfigNameGen: Config = {
  dictionaries: [adjectives, starWars, numberDictionary],
  separator: '-',
  length: 3,
};

export const registerWithEmail = async (email: string, password: string): Promise<PrintsUser> => {
  let displayName: string = uniqueNamesGenerator(customConfigNameGen)
    .replaceAll(' ', '-')
    .toLowerCase();
  let photoURL = './assets/user-unknown-com.svg';
  let user: any = null;
  let fbUser: firebase.User;

  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        fbUser = res.user as firebase.User;

        user = cloneDeepWith(res, (_val, key) => {
          switch (key) {
            case 'photoURL':
              return photoURL;
            case 'displayName':
              return displayName;
            default:
              return undefined;
          }
        });

        return fbUser?.updateProfile({
          displayName: displayName,
          photoURL: photoURL,
        });
      })
      .then(() => {
        return fbUser.sendEmailVerification();
      })
      .then(() => resolve(remapUser(user)))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const loginWithSSOStart = (provider: ProviderSSO): boolean => {
  sessionStorage.setItem('3dreact:sso', 'logging');

  if (provider === ProviderSSO.FACEBOOK) {
    facebookProvider.addScope('public_profile');
    facebookProvider.addScope('email');

    myFirebase.auth().signInWithRedirect(facebookProvider);
  }

  if (provider === ProviderSSO.GOOGLE) {
    myFirebase.auth().signInWithRedirect(googleProvider);
  }

  return true;
};

export const loginWithSsoFinish = (): Promise<PrintsUser> => {
  let fbUser: any;
  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .getRedirectResult()
      .then((res) => {
        fbUser = res;

        return res.user?.updateProfile({
          photoURL:
            (res.additionalUserInfo?.profile as any)?.picture?.data?.url ??
            (res.additionalUserInfo?.profile as any).picture,
        });
      })
      .then(() => resolve(remapUser(fbUser)))
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
        resolve(remapUser(res));
      })
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const getCurrentUser = (): Observable<PrintsUser | null> => {
  return new Observable((subscriber) => {
    myFirebase.auth().onAuthStateChanged({
      next: (user) => {
        subscriber.next(
          user
            ? {
                email: user?.email as string,
                displayName: user?.displayName as string,
                photoURL: user?.photoURL ?? '',
                uid: user?.uid as string,
                emailVerified: user.emailVerified,
              }
            : null,
        );
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

export const updateUser = (newData: any): Promise<PrintsUser> => {
  return new Promise((resolve, reject) => {
    const currUser = myFirebase.auth().currentUser;

    if (newData.email === currUser?.email) {
      const updatedUser = cloneDeepWith(currUser, (_val, key) => {
        if (key === 'displayName') return newData.displayName;

        return undefined;
      });

      currUser
        ?.updateProfile({ displayName: newData.displayName })
        .then(() => resolve(updatedUser))
        .catch((e) => reject(fbErrorMessages(e)));
    } else {
      const updatedUser = cloneDeepWith(currUser, (_val, key) => {
        if (key === 'displayName') return newData.displayName;

        if (key === 'email') return newData.email;

        return undefined;
      });

      currUser
        ?.updateProfile({ displayName: newData.displayName })
        .then(() => currUser.updateEmail(newData.email))
        .then(() => resolve(updatedUser))
        .catch((e) => reject(fbErrorMessages(e)));
    }
  });
};

export const resetPasswordsRequest = (email: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const auth = myFirebase.auth();

    auth
      .sendPasswordResetEmail(email)
      .then(() => resolve(email))
      .catch((err: any) => reject(fbErrorMessages(err)));
  });
};

export const sendVerifyEmail = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    myFirebase
      .auth()
      .currentUser?.sendEmailVerification()
      .then(() => resolve(true))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const verifyEmail = (actionCode: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const auth = myFirebase.auth();

    auth
      .applyActionCode(actionCode)
      .then(() => resolve(true))
      .catch((error) => reject(error));
  });
};

export const checkActionCodeRecoverEmail = (actionCode: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const auth = myFirebase.auth();

    auth
      .checkActionCode(actionCode)
      .then(() => resolve(true))
      .catch(() => reject(false));
  });
};

export const verifyCodeResetPassword = (actionCode: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const auth = myFirebase.auth();

    auth
      .verifyPasswordResetCode(actionCode)
      .then(() => resolve(true))
      .catch(() => reject(false));
  });
};

export const resetPassword = (actionCode: string, password: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const auth = myFirebase.auth();
    auth
      .confirmPasswordReset(actionCode, password)
      .then(() => resolve(true))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const deleteUser = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const user = myFirebase.auth().currentUser as firebase.User;

    user
      .delete()
      .then(() => {
        return deleteUserDevices(user as PrintsUser);
      })
      .then((res) => resolve(res))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const loadUserDevicesService = (user: PrintsUser): Promise<Device[]> => {
  return new Promise<Device[]>((resolve, reject) => {
    db.collection('devices')
      .where('uid', '==', user.uid)
      .get()
      .then((devices) => {
        const userDevices: Device[] = [];

        devices.forEach((device) => {
          const uDevice: Device = device.data() as Device;

          uDevice.id = device.id;

          userDevices.push(uDevice);
        });

        resolve(userDevices as Device[]);
      })
      .catch((e) => reject(e));
  });
};

export const loadDevicesService = (center: firebase.firestore.GeoPoint): Promise<Device[]> => {
  return new Promise<Device[]>((resolve, reject) => {
    const geocollection = GeoFirestore.collection('devices');

    const query = geocollection.near({ center, radius: 8 });

    query
      .get()
      .then((devices: any) => {
        const viewDevices: Device[] = [];

        devices.forEach((device: any) => {
          const uDevice: Device = device.data() as Device;

          uDevice.id = device.id;

          viewDevices.push(uDevice);
        });

        resolve(viewDevices as Device[]);
      })
      .catch((e) => reject(e));
  });
};

export const loadAllDevicesService = (): Promise<Device[]> => {
  return new Promise((resolve, reject) => {
    db.collection('devices')
      .get()
      .then((devices) => {
        const viewDevices: Device[] = [];
        devices.forEach((device) => {
          const uDevice: Device = device.data() as Device;

          uDevice.id = device.id;

          viewDevices.push(uDevice);
        });

        resolve(viewDevices as Device[]);
      });
  });
};

export const addDevice = (device: Device): Promise<Device> => {
  return new Promise((resolve, reject) => {
    const geocollection = GeoFirestore.collection('devices');

    geocollection
      .add(device)
      .then(() => resolve(device))
      .catch((e) => reject(e));
  });
};

export const removeDevice = (device: Device): Promise<Device> => {
  return new Promise((resolve, reject) => {
    db.collection('devices')
      .doc(device.id)
      .delete()
      .then(() => resolve(device))
      .catch((e) => reject(e));
  });
};

export const getPrinters = (): Promise<Printer[]> => {
  return new Promise<Printer[]>((resolve, reject) => {
    db.collection('printers')
      .get()
      .then((docs) => {
        const printers = docs.docs.map((doc) => doc.data() as Printer);

        resolve(printers);
      })
      .catch((e) => reject(e));
  });
};

export const deleteUserDevices = (user: PrintsUser): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const writeBatch = db.batch();

    db.collection('devices')
      .where('uid', '==', user.uid)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          writeBatch.delete(doc.ref);
        });

        return writeBatch.commit();
      })
      .then(() => resolve(true))
      .catch((e) => reject(fbErrorMessages(e)));
  });
};

export const getUserRooms = (user: PrintsUser): Promise<RoomData[]> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .where('users', 'array-contains', user.uid)

      .get()
      .then((res) => {
        const docs: RoomData[] = [];
        res.forEach((doc) => docs.push({ roomId: doc.id, data: doc.data() as ChatData }));

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

export const getUserMessages = (selected: string): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    const doc = db
      .collection('chats')
      .doc(selected)
      .collection('messages')
      .orderBy('time', 'desc')
      .limit(15);

    doc
      .get()
      .then((res) => {
        const remapedMessages = res.docs.map((doc) => {
          const message: Message = { ...(doc.data() as Message), doc };

          return message;
        });

        resolve(remapedMessages);
      })
      .catch((e) => reject(e));
  });
};

export const loadMoreMessages = (selected: string, lastDoc: any): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    const topMessages = db
      .collection('chats')
      .doc(selected)
      .collection('messages')
      .orderBy('time', 'desc')
      .startAfter(lastDoc)
      .limit(5);

    topMessages
      .get()
      .then((res) => {
        const remapedMessages = res.docs.map((doc) => {
          const message: Message = { ...(doc.data() as Message), doc };

          return message;
        });

        resolve(remapedMessages);
      })
      .catch((e) => reject(e));
  });
};

export const getNewMessage = (
  selected: string,
): firebase.firestore.Query<firebase.firestore.DocumentData> => {
  const doc = db
    .collection('chats')
    .doc(selected)
    .collection('messages')
    .orderBy('time', 'desc')
    .limit(1);

  return doc;
};

export const addMessage = (
  message: Message,
  selected: string,
  reciever: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .doc(selected)
      .update({ recieverHasRed: false, reciever })
      .then(() => {
        return db.collection('chats').doc(selected).collection('messages').add(message);
      })
      .then(() => resolve(true))
      .catch((e) => reject(e));
  });
};

export const updateMessageStatus = (room: RoomData, recieverHasRed: boolean): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    db.collection('chats')
      .doc(room.roomId)
      .update({ recieverHasRed })
      .then(() => resolve(true))
      .catch((e) => reject(e));
  });
};
