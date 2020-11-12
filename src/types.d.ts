export type RootState = {
  auth: AuthState;
  errors: ErrorsState;
  devices: DeviceState;
  notifications: NotificationState;
  chat: ChatState;
};

export type AuthState = {
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  isVerifying: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: PrintsUser;
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
  canVote: boolean;
}

export type PrintsUser = {
  firstName: string;
  lastName: string;
  email: string;
  rating: number;
  pic: string;
  uid: string | undefined;
  username: string;
  refreshToken?: string;
  devices?: Device[];
};

export type RoomData = {
  id: string;
  data: ChatData;
};

export type ChatData = {
  users: string[];
  voted: boolean;
  recieverHasRed: boolean;
  title: string;
  chatDevice: Device;
};

type NotificationItem = { key: number; msg: string };

type Message = {
  message: string;
  author: string;
  time: firebase.firestore.FieldValue;
};

export type Coords = {
  lat: number;
  lng: number;
};

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
  id?: string;
  rating?: number;
}

export type PrintsGenericError = {
  message: string;
  code: any;
};
