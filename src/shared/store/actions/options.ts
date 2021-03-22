import { createAction } from 'typesafe-actions';

import { SET_IS_CLOUD_MESSAGE_TOKEN_VALID, SET_NOTIFIACTION_PERMISSION } from '../constants';

export const setCloudMessageToken = createAction(SET_IS_CLOUD_MESSAGE_TOKEN_VALID)<
  boolean | string
>();

export const setNotficationPermision = createAction(SET_NOTIFIACTION_PERMISSION)<boolean>();
