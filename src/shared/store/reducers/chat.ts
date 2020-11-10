import { createReducer } from 'typesafe-actions';
import { RootAction, actions } from '..';
import { ChatState } from '../../../types';

const initialState: ChatState = { canVote: false };

export const chatReducer = createReducer<ChatState, RootAction>(initialState).handleAction(
  actions.setCanVote,
  (state, action) => {
    return {
      ...state,
      canVote: action.payload,
    };
  },
);
