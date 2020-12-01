import { createAction } from 'typesafe-actions';
import { Message } from '../../../types';

import { ADD_PREV_MESSAGES, ADD_MESSAGE, START_WRITING, SET_MESSAGES } from '../constants';

export const addPrevMessages = createAction(ADD_PREV_MESSAGES)<Message[]>();

export const setMessages = createAction(SET_MESSAGES)<Message[]>();

export const addMessage = createAction(ADD_MESSAGE)<Message>();

export const startWriting = createAction(START_WRITING)<boolean>();
