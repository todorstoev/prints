export const LOGIN_REQUEST = '@@auth/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@auth/LOGIN_SUCCESS';
export const LOGIN_CANCEL = '@@auth/LOGIN_CANCEL';

export const SSO_LOGIN_REQUEST = '@@auth/SSO_LOGIN_REQUEST';
export const SSO_LOGIN_SUCCESS = '@@auth/SSO_LOGIN_SUCCESS';

export const REGISTER_REQUEST = '@@auth/REGISTER_REQUEST';
export const REGISTER_SUCCESS = '@@auth/REGISTER_SUCCESS';
export const REGISTER_CANCEL = '@@auth/REGISTER_CANCEL';

export const SET_COOKIE_CONSENT = '@@auth/SET_SET_COOKIE_CONSENT';

export const LOGOUT_REQUEST = '@@auth/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = '@@auth/LOGOUT_SUCCESS';

export const UPDATE_USER_REQUEST = '@@auth/UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = '@@auth/UPDATE_USER_SUCCESS';

export const VERIFY_USER_REQUEST = '@@auth/VERIFY_REQUEST';
export const VERIFY_USER_SUCCESS = '@@auth/VERIFY_SUCCESS';
export const VERIFY_USER_CANCEL = '@@auth/VERIFY_CANCEL';

export const DELETE_USER_REQUEST = '@@auth/DELETE_USER_REQUEST';
export const DELETE_USER_SUCCESS = '@@auth/DELETE_USER_SUCCESS';

export const REQUEST_DEVICE_ADD = '@@devices/REQUEST_DEVICE_ADD';
export const SUCCESS_DEVICE_ADD = '@@devices/SUCCESS_DEVICE_ADD';

export const REQUEST_DEVICE_REMOVE = '@@devices/REQUEST_DEVICE_REMOVE';
export const SUCCESS_DEVICE_REMOVE = '@@devices/SUCCESS_DEVICE_REMOVE';
export const CANCEL_DEVICE_REMOVE = '@@devices/CANCEL_DEVICE_REMOVE';

export const REQUEST_LOAD_DEVICES = '@@devices/REQUEST_LOAD_DEVICES';
export const SUCCESS_LOAD_DEVICES = '@@devices/SUCCESS_LOAD_DEVICES';
export const CLEAR_DEVICES = '@devices/CLEAR_DEVICES';

export const AUTH_ERROR = '@@errors/LOGIN_ERROR';
export const CLEAR_AUTH_ERRORS = '@@errors/CLEAR_AUTH_ERRORS';
export const DEVICE_ERROR = '@@errors/DEVICE_ERROR';

export const ADD_NOTIFICATION = '@@notifcations/ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = '@@notifications/REMOVE_NOTIFICATION';

export const ADD_PREV_MESSAGES = '@chat/ADD_PREV_MESSAGES';
export const SET_MESSAGES = '@chat/SET_MESSAGES';
export const ADD_MESSAGE = '@chat/ADD_MESSAGE';
export const START_WRITING = `@chat/START_TYPING`;

export const CHANGE_MAP_BOUNDS = '@map/CHANGE_MAP_BOUNDS';
export const CHANGE_USER_LOC = '@map/CHANGE_USER_LOC';
export const REQUEST_MAP_BOUNDS = '@map/REQUEST_MAP_BOUNDS';
export const SUCCESS_MAP_BOUNDS = '@map/SUCCESS_MAP_BOUNDS';
