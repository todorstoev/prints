import { createAction } from 'typesafe-actions';

import { SET_CAN_VOTE } from '../constants';

export const setCanVote = createAction(SET_CAN_VOTE)<boolean>();
