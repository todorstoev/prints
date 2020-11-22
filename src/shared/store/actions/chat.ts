import { createAction } from 'typesafe-actions';
import { Message } from '../../../types';

import { SET_CAN_VOTE, ADD_PREV_MESSAGES, ADD_MESSAGE, START_WRITING } from '../constants';

export const setCanVote = createAction(SET_CAN_VOTE)<boolean>();

export const addPrevMessages = createAction(ADD_PREV_MESSAGES)<Message[]>();

export const addMessage = createAction(ADD_MESSAGE)<Message>();

export const startWriting = createAction(START_WRITING)<boolean>();
