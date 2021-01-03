export type RootState = {
  auth: AuthState;
  errors: ErrorsState;
  devices: DeviceState;
  map: MapState;
  notifications: NotificationState;
  chat: ChatState;
};

export type AuthState = {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isVerifying: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  cookieConsent: boolean;
  user: PrintsUser;
};

export type MapState = {
  bounds: {
    north: firebase.firestore.GeoPoint;
    south: firebase.firestore.GeoPoint;
  };
  userLoc: firebase.firestore.GeoPoint;
  isLoading: boolean;
};

export interface ErrorsState {
  devicesError?: PrintsGenericError | null;
  authError?: PrintsGenericError | null;
}

export interface DeviceState {
  userDevices: Device[];
  allDevices: Device[];
  isLoading: boolean;
}

export interface NotificationState {
  items: NotificationItem[];
}

export interface ChatState {
  messages: Message[];
  writing: boolean;
}

export type PrintsUser = {
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  refreshToken?: strinig;
  emailVerified: boolean;
};

export type RoomData = {
  roomId: string;
  data: ChatData;
};

export type ChatData = {
  users: string[];
  titles: string[];
  recieverHasRed: boolean;
  chatDevice: Device;
};

type NotificationItem = { key: number; msg: string };

type Message = {
  message: string;
  author: string;
  time: firebase.firestore.FieldValue;
  doc?: firebase.firestore.DocumentData;
};

export type Coords = firebase.firestore.GeoPoint;
export interface Printer {
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  brand: string;
  model: string;
}

export interface Device extends Printer {
  location: Coords;
  materials: string[];
  type: string;
  uemail: string;
  uname: string;
  uid: string; // device users id
  id?: string; // device id
}

export type PrintsGenericError = {
  message: string;
  code: any;
};
