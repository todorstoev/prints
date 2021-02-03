import { createAction } from 'typesafe-actions';
import { Message, PrintsUser, RoomData } from '../../../types';

import {
  ADD_PREV_MESSAGES,
  ADD_MESSAGE,
  START_WRITING,
  SET_MESSAGES,
  ROOMS_REQUEST,
  ROOMS_SUCCESS,
  ROOMS_CANCEL,
} from '../constants';

export const addPrevMessages = createAction(ADD_PREV_MESSAGES)<Message[]>();

export const setMessages = createAction(SET_MESSAGES)<Message[]>();

export const addMessage = createAction(ADD_MESSAGE)<Message>();

export const startWriting = createAction(START_WRITING)<boolean>();

export const roomRequest = createAction(ROOMS_REQUEST)<PrintsUser>();

export const roomSuccess = createAction(ROOMS_SUCCESS)<{ data: RoomData[]; user: PrintsUser }>();

export const roomCancel = createAction(ROOMS_CANCEL)();
